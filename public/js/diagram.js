var csv = "";
var loaded_curriculum = {
	code: '',
	title: '',
	department: '',
	csv: '',
	author: ''
};

var curr_exist = false;

var import_flag = false;

var curriculum = {}; //json for the curriculum
var subjectArr = []; //save positions
var colCount = 0;
var rowCount = 0;
var graphScale = 1;
var selectedSubject = null;
var linkSource;
var linkTarget;
var changeLink = false;
var removing = false;

var yearCount = 4; //default no. of years
var xMax = $('#diagram-container').width();
var yMax = $('#diagram-container').height();
var semDivider = xMax/(yearCount*2);
var gridWidth = ((semDivider/2) + (semDivider/4))*2;
var dragFlag = false; //scroll paper on mouse drag
var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
		el: $('#diagram-container'),
		width: xMax*2,
		height: yMax*2,
		model: graph,
		gridSize: gridWidth/2,
		defaultLink: new joint.dia.Link({
				router: { name: 'manhattan' },
    		connector: { name: 'rounded' },
				attrs: {
					'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
					'.connection': { 'stroke-width': 2 }
				}
		}),
		validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Prevent linking from input ports.
        if (magnetS && magnetS.getAttribute('type') === 'input') return false;
        // Prevent linking from output ports to input ports within one element.
        if (cellViewS === cellViewT) return false;
        // Prevent linking to input ports.
        return magnetT && magnetT.getAttribute('type') === 'input';
    },
		validateMagnet: function(cellView, magnet) {
        // Note that this is the default behaviour. Just showing it here for reference.
        // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
        return magnet.getAttribute('magnet') !== 'passive';
    },
		restrictTranslate: true,
		snapLinks: { radius: 75 },
		multiLinks: false
});


var containerHeight = gridWidth * 10;
var subjectContainer = new joint.shapes.basic.Rect({
    position: { x: 0-(semDivider/4), y: 0-semDivider/4 },
    size: { width: gridWidth*yearCount*2, height: containerHeight+semDivider/4 },
    attrs: { rect: { style: {'pointer-events': 'none'}, 'stroke-width': 0, fill: 'none'} }
});
graph.addCell(subjectContainer);

for(i=0; i<yearCount; i++){
	var yearPrefix;
	if(i+1 == 1) yearPrefix = " 1st"
	else if(i+1 == 2) yearPrefix = " 2nd";
	else if(i+1 == 3) yearPrefix = " 3rd";
	else yearPrefix = " "+(i+1)+ "th";

	var yearLabel = V('rect', {x: i*(gridWidth*2)-semDivider/4, y: 0-gridWidth/2-semDivider/4, width: gridWidth*2, height: gridWidth/4, fill:'none',
											 stroke: 'black', 'stroke-width': 3});
	var yearText = V('text', {x: i*(gridWidth*2)-semDivider/4, y: 0-(3*gridWidth/2-semDivider/2)/2+10, fill: 'black'})
	yearText.text(yearPrefix+' Year', { lineHeight: 'auto', annotations: [
    { start: 0, end: 50, attrs: {'font-size': 20 } },]});

	V(paper.viewport).append(yearLabel);
	V(paper.viewport).append(yearText);
}
for(i=0; i<yearCount*2; i++){
	var semLabel;
	if(i%2 == 0) semLabel = " 1st Sem";
	else semLabel = " 2nd Sem";

	var sem = V('rect', {x: i*(gridWidth)-semDivider/4, y: 0-gridWidth/4-semDivider/4, width: gridWidth, height: gridWidth/4, fill:'none',
											 stroke: 'black', 'stroke-width': 3});
	var semText = V('text', {x: i*(gridWidth)-semDivider/4, y: 0-(3*gridWidth/4-semDivider/4)/2+10, fill: 'black'})
	semText.text(semLabel, { lineHeight: 'auto', annotations: [
    { start: 0, end: 50, attrs: {'font-size': 20 } },]});

	V(paper.viewport).append(sem);
	V(paper.viewport).append(semText);
}

//grid columns for years and semesters
for (i = 0; i <= yearCount*2; i++) {
	var line = V('line', { x1: gridWidth*i-(semDivider/4), y1: 0-semDivider/4, x2: gridWidth*i-(semDivider/4), y2: containerHeight, stroke: 'black', 'stroke-width': 3 });
	V(paper.viewport).append(line);
}
var line = V('line', { x1: 0-(semDivider/4), y1: 0-semDivider/4, x2: gridWidth*8-(semDivider/4), y2: 0-semDivider/4, stroke: 'black', 'stroke-width': 3 });
var line2 = V('line', { x1: 0-(semDivider/4), y1: containerHeight+semDivider/4-semDivider/4, x2: gridWidth*8-(semDivider/4), y2: containerHeight+semDivider/4-semDivider/4, stroke: 'black', 'stroke-width': 3 });
V(paper.viewport).append(line);
V(paper.viewport).append(line2);
paper.setOrigin((xMax-gridWidth*yearCount)/2,(gridWidth/4+semDivider/4));
zoomPaper(-0.5);



$('#diagram-container').bind('mousewheel', function(event) {
		event.preventDefault(); //disable scroll through mousewheel
    if (event.originalEvent.wheelDelta >= 0) {
				zoomPaper(0.05);
    }
    else {
				zoomPaper(-0.05);
    }
});
$(document).on('keyup',function(e){ //deletes selected subject
	if(e.keyCode == 46) removeSubject();
//	console.log(e.keyCode);
});
$(document).ready(function() {
    $('select').material_select();
    if(curr_id) {
	    $.ajax({
		        url: '/curriculum/list/' + curr_id,
		        type: 'get',
		        success: function(data) {
		        	loaded_curriculum = data;
		        	showComments('curriculum');
		        	document.getElementById("curriculum-title").innerHTML = loaded_curriculum.title;
		        	csv = loaded_curriculum.csv;
		        	curr_exist = true;
		        	importCSV();
		        	var dept = document.getElementById("dept_opts");
		        	dept.value = loaded_curriculum.department;

		        	if(loaded_curriculum.author != user_id) {
		        		var div = document.getElementById("save-button");
		        		div.innerHTML = "";
		        	}
	 	        },
		        error: function(e) {
		            console.log(e.message);
		        }
		    });
	}
	if(!user_id) {
		var div = document.getElementById("save-button");
		div.innerHTML = "";
	}
 });
function removeSubject(){
	if(selectedSubject != null){
		for(i=0; i<subjectArr.length; i++) if(subjectArr[i].attr('.label/text') == selectedSubject.attr('.label/text')) subjectArr.splice(i,1);
		selectedSubject.attr({ rect: { 'stroke-width': 0 } });
		selectedSubject.remove();
		selectedSubject = null;
	}
}

function dragPaper(){ //scrolls paper on drag
	if(dragFlag){
//		var canvasDiv = document.getElementById("diagram-container");
//		canvasDiv.scrollLeft += dragStartPosition.x - event.offsetX;
//		canvasDiv.scrollTop += dragStartPosition.y - event.offsetY;
			paper.setOrigin(
				event.offsetX - dragStartPosition.x,
				event.offsetY - dragStartPosition.y);
	}
}

function zoomPaper(value){
		graphScale += value;
		paper.scale(graphScale);
}

paper.on('blank:pointerdown', function(evt, x, y){ //drag paper on press
		dragFlag = true;
		var scale = V(paper.viewport).scale();
		dragStartPosition = { x: x * scale.sx, y: y * scale.sy};
});
paper.on('blank:pointerup', function(evt, x, y){ //stop drag paper after press
		dragFlag = false;
//		delete dragStartPosition;
});
paper.on('blank:pointerclick', function(evt, x, y){ //removes selected/highlighten subject on paper click
	if(selectedSubject != null){
		selectedSubject.attr({ rect: { 'stroke-width': 0 } });
		selectedSubject = null;
	}
});

paper.on('cell:pointerclick', function(evt, x, y) { //selects and highlights clicked subject
	if(selectedSubject != null){
		selectedSubject.attr({ rect: { 'stroke-width': 0 } });
		selectedSubject = null;
	}
	selectedSubject = evt.model;
	evt.model.attr({ rect: { stroke: 'black', 'stroke-width': 3 } });
	$.get("/courses/find/" + evt.model.id,
		        function(data) {
		        	document.getElementById("coursecode").innerHTML = data[0].code;
		        	document.getElementById("coursecode-comment").innerHTML = data[0].code;
		        	document.getElementById("coursetitle").innerHTML = data[0].title;
		        	document.getElementById("coursetitle-comment").innerHTML = data[0].title;
		        	document.getElementById("units-subj").innerHTML = data[0].units;

		       		var stack = [];
    				var tokens = data[0].prerequisite.split("+");
    				var output = "";

    				for(var token = tokens.length-1; token > -1; token--)
        				stack.push(tokens[token])

        			output = convert(stack);
					document.getElementById("prereq").innerHTML = output;

        			var term = [];
		        	for(var i=0; i<data[0].term.length; i++)
		        		term.push(data[0].term[i]);

		        	document.getElementById("courseterm").innerHTML = term.join();
		        }
		);
});
paper.on('cell:pointerdblclick', function(evt, x, y) { // CHANGE TO INFO TAB - dbclick subject event handler
		$.get("/courses/find/" + evt.model.id,
		        function(data) {

		        	if(data.length == 0) {
		        		document.getElementById("coursecode").innerHTML = evt.model.attr('.label/text');
			        	document.getElementById("coursecode-comment").innerHTML = evt.model.attr('.label/text');
			        	document.getElementById("coursetitle").innerHTML = "";
			        	document.getElementById("coursetitle-comment").innerHTML = "course not in database";
			        	document.getElementById("units-subj").innerHTML ="";
						document.getElementById("prereq").innerHTML = "";
			        	document.getElementById("courseterm").innerHTML = "";
			        	return
		        	}

		        	document.getElementById("coursecode").innerHTML = data[0].code;
		        	document.getElementById("coursecode-comment").innerHTML = data[0].code;
		        	document.getElementById("coursetitle").innerHTML = data[0].title;
		        	document.getElementById("coursetitle-comment").innerHTML = data[0].title;

		        	var term = [];
		        	for(var i=0; i<data[0].term.length; i++)
		        		term.push(data[0].term[i]);

		        	document.getElementById("courseterm").innerHTML = term.join();
		        }
		);
		$('ul.tabs').tabs('select_tab', 'tab-info');
});
paper.on('cell:pointerdown', function(evt, x, y){
	if(evt.model.isLink()){
		if(evt.model.attributes.source.id != null && evt.model.attributes.target.id != null){
			linkSource = evt.model.attributes.source.id;
			linkTarget = evt.model.attributes.target.id;
			changeLink = true;

		}
	}
	removing = false;
});
paper.on('cell:pointerup', function(evt, x, y){ //if link connection target/source will be changed
	if(evt.model.isLink()){
		if(changeLink == true && !removing){
			if(linkSource != evt.model.attributes.source.id || linkTarget != evt.model.attributes.target.id){
				var temp = evt.model.attributes;
//				if(temp.target.id != linkTarget){
//					curriculum[temp.source.id].splice(curriculum[temp.source.id].indexOf(linkTarget), 1);
//				} else {
					curriculum[linkSource].splice(curriculum[linkSource].indexOf(linkTarget), 1);

				linkSource = null;
				linkTarget = null;
				changeLink = false;
			}
		}
		if (evt.model.attributes.source.id && evt.model.attributes.target.id && !removing) {
			var sourceId = evt.model.attributes.source.id;
			var targetId = evt.model.attributes.target.id;

			$.get("/courses/find/" + targetId,
		        function(data) {
		        	var prereqs = data[0].prerequisite.replace(/OR/g, "").replace(/AND/g, "").split("+");
		        	if(!contains.call(prereqs,sourceId))
		        		Materialize.toast(sourceId + " is not a prerequisite of "+ targetId, 4000);
		        }
			);

			if(curriculum[sourceId] == null){
					curriculum[sourceId] = [];
					curriculum[sourceId].push(targetId);
			} else {
					if(jQuery.inArray(targetId , curriculum[sourceId]) == -1) curriculum[sourceId].push(targetId);
			}
		}
	} else {
		$.get("/courses/find/" + evt.model.id,
		        function(data) {
		        	var offered = getSemester(evt.model);

		        	var sched;

		        	if(offered == '1') sched = "First Semester";
		        	else if(offered == '2') sched = "Second Semester";
		        	else if(offered == 'S') sched = "Midyear";


	       			if(data[0].term.indexOf(offered) === -1 && offered) {
	       				Materialize.toast(data[0].code +" is not usually offered during " + sched, 4000);
	       			}
		        }
		);
	}
});

graph.on('change:source change:target', function(link) { // CONNECTING SUBJECT - linking event handler
    if (link.get('source').id && link.get('target').id) { //if 2 subjects are connected
			if(link.getSourceElement().attributes.position.x >= link.getTargetElement().attributes.position.x){
				link.attr({
					'.connection': { stroke: 'red' },
					'.marker-target': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }
				});
				console.log("error");
			}
			if(Math.abs(link.getSourceElement().attributes.position.x - link.getTargetElement().attributes.position.x) > (gridWidth + gridWidth/2)){
				link.set('router', { name: 'manhattan' } );
			}  else {
				link.unset('router');
			}
    }
});
graph.on('change:position', function(cell) { //constantly checks for conflicts based on source and target positions
	var outSubj = graph.getConnectedLinks(cell, { outbound: true });
	var inSubj = graph.getConnectedLinks(cell, { inbound: true });
	outSubj.forEach(function(link) { //CONFLICT CHECKING FOR OUTWARD LINKS
		if(link.getTargetElement() != null){ //SETS RED LINKS IF TARGET PORTS HAVE LOWER X VALUE
			if(link.getSourceElement().attributes.position.x >= link.getTargetElement().attributes.position.x){
				link.attr({
					'.connection': { stroke: 'red' },
					'.marker-target': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }
				});
			} else {
				link.attr({
					'.connection': { stroke: 'black' },
					'.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
				});
			}
			if(Math.abs(link.getSourceElement().attributes.position.x - link.getTargetElement().attributes.position.x) > (gridWidth + gridWidth/2)){
				link.set('router', { name: 'manhattan' } );
			}  else {
				link.unset('router');
			}
		}
});
	inSubj.forEach(function(link) { //CONFLICT CHECKING FOR INWARD LINKS
		if(link.getSourceElement() != null){ //SETS RED LINKS IF TARGET PORTS HAVE LOWER X VALUE
			if(link.getSourceElement().attributes.position.x >= link.getTargetElement().attributes.position.x){
				link.attr({
					'.connection': { stroke: 'red' },
					'.marker-target': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }
				});
			} else {
				link.attr({
					'.connection': { stroke: 'black' },
					'.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
				});
			}
			if(Math.abs(link.getSourceElement().attributes.position.x - link.getTargetElement().attributes.position.x) > (gridWidth + gridWidth/2)){
				link.set('router', { name: 'manhattan' } );
			}  else {
				link.unset('router');
			}
		}
	});

	//BOUND SUBJECTS INSIDE BOX
	var parentId = cell.get('parent');
	if (!parentId) return;

	var parent = graph.getCell(parentId);
	var parentBbox = parent.getBBox();
	var cellBbox = cell.getBBox();

	if (parentBbox.containsPoint(cellBbox.origin()) &&
			parentBbox.containsPoint(cellBbox.topRight()) &&
			parentBbox.containsPoint(cellBbox.corner()) &&
			parentBbox.containsPoint(cellBbox.bottomLeft())) {

			// All the four corners of the child are inside
			// the parent area.
			return;
	}
	// Revert the child position.
	cell.set('position', cell.previous('position'));
});
graph.on('remove', function(cell, collection, opt) {
	if (cell.isLink()) { //remove connection between subjects when link is removed
		if (cell.get('source').id && cell.get('target').id) {
			curriculum[cell.get('source').id].splice(curriculum[cell.get('source').id].indexOf(cell.get('target').id), 1);
			removing = true;
		}
	}
});

function changeYear(year){
	if(!curr_exist){
		var choice = confirm("Canvas will be cleared! Are you sure?");

		if(!choice)
			return
	}

	document.getElementById('edit-tab-curriculum-year').value = year;
	yearCount = year;
	clearCanvas(); //remove elements
	graph.clear(); //remove bounding rectangle since rect width will be adjusted
	subjectContainer = new joint.shapes.basic.Rect({
	    position: { x: 0-(semDivider/4), y: 0-semDivider/4 },
	    size: { width: gridWidth*yearCount*2, height: containerHeight+semDivider/4 },
	    attrs: { rect: { style: {'pointer-events': 'none'}, 'stroke-width': 0, fill: 'none'} }
	});
	graph.addCell(subjectContainer);
	var temp = V(paper.viewport).find('text');
	for(j=0; j<temp.length; j++) temp[j].remove();
	temp = V(paper.viewport).find('line');
	for(j=0; j<temp.length; j++) temp[j].remove();
	temp = V(paper.viewport).find('rect');
	for(j=0; j<temp.length; j++) temp[j].remove();

	for(i=0; i<yearCount; i++){
		var yearPrefix;
		if(i+1 == 1) yearPrefix = " 1st"
		else if(i+1 == 2) yearPrefix = " 2nd";
		else if(i+1 == 3) yearPrefix = "3rd";
		else yearPrefix = "   "+(i+1)+ "th";

		var yearLabel = V('rect', {x: i*(gridWidth*2)-semDivider/4, y: 0-gridWidth/2-semDivider/4, width: gridWidth*2, height: gridWidth/4, fill:'none',
												 stroke: 'black', 'stroke-width': 3});
		var yearText = V('text', {x: i*(gridWidth*2)-semDivider/4, y: 0-(3*gridWidth/2-semDivider/2)/2+10, fill: 'black'})
		yearText.text(yearPrefix+' Year', { lineHeight: 'auto', annotations: [
	    { start: 0, end: 50, attrs: {'font-size': 20 } },]});

		V(paper.viewport).append(yearLabel);
		V(paper.viewport).append(yearText);
	}
	for(i=0; i<yearCount*2; i++){
		var semLabel;
		if(i%2 == 0) semLabel = "1st Sem";
		else semLabel = "2nd Sem";

		var sem = V('rect', {x: i*(gridWidth)-semDivider/4, y: 0-gridWidth/4-semDivider/4, width: gridWidth, height: gridWidth/4, fill:'none',
												 stroke: 'black', 'stroke-width': 3});
		var semText = V('text', {x: i*(gridWidth)-semDivider/4, y: 0-(3*gridWidth/4-semDivider/4)/2+10, fill: 'black'})
		semText.text(semLabel, { lineHeight: 'auto', annotations: [
	    { start: 0, end: 50, attrs: {'font-size': 20 } },]});

		V(paper.viewport).append(sem);
		V(paper.viewport).append(semText);
	}

	//grid columns for years and semesters
	for (i = 0; i <= yearCount*2; i++) {
		var line = V('line', { x1: gridWidth*i-(semDivider/4), y1: 0-semDivider/4, x2: gridWidth*i-(semDivider/4), y2: containerHeight, stroke: 'black', 'stroke-width': 3 });
		V(paper.viewport).append(line);
	}
	var line = V('line', { x1: 0-(semDivider/4), y1: 0-semDivider/4, x2: gridWidth*8-(semDivider/4), y2: 0-semDivider/4, stroke: 'black', 'stroke-width': 3 });
	var line2 = V('line', { x1: 0-(semDivider/4), y1: containerHeight+semDivider/4-semDivider/4, x2: gridWidth*yearCount*2-(semDivider/4), y2: containerHeight+semDivider/4-semDivider/4, stroke: 'black', 'stroke-width': 3 });
	V(paper.viewport).append(line);
	V(paper.viewport).append(line2);
	console.log(paper.viewport);
	// paper.setOrigin((xMax-gridWidth*yearCount)/2,(gridWidth/4+semDivider/4));
	zoomPaper(0);
	curr_exist = false;
}

function clearCanvas(){
	graph.clear();
	curriculum = {};
	subjectArr = [];
	graph.addCell(subjectContainer);
}
function exportCSV(){
	var dept_opts = document.getElementById("dept_opts");
    var department = dept_opts.options[dept_opts.selectedIndex].value;

	var exp = "";
	var temp = "";
	var year = 1;
	var tempX, tempY;
	var subjExist = false;

	exp += department + "\r\n";
	exp += document.getElementById("edit-tab-degree").value + "\r\n";
	exp += document.getElementById("edit-tab-curriculum-code").value + "\r\n";

	for(j=0; j<yearCount*2; j++){ //print per column
		subjExist = false;
		tempX = gridWidth * j;
		temp = year + "-" + ((j%2)+1);
		for(i=0; i<20; i++){ //traverse through all rows to check for subjects
			tempY = gridWidth/2 * i;
			for(k=0; k<subjectArr.length; k++){
				if(subjectArr[k].attributes.position.x == tempX && subjectArr[k].attributes.position.y == tempY){
					subjExist = true;
					temp += "," + subjectArr[k].attr('.label/text');
					break;
				}
			}
			if(i == 19 && subjExist) exp+=temp + "\r\n";
		}
		if(((j%2)+1) == 2){ //check for midyear subjects
			subjExist = false;
			tempX = (gridWidth * j) + gridWidth/2;
			temp = year + "-3";
			for(i=0; i<20; i++){ //traverse through all rows to check for subjects
				tempY = gridWidth/2 * i;
				for(k=0; k<subjectArr.length; k++){
					if(subjectArr[k].attributes.position.x == tempX && subjectArr[k].attributes.position.y == tempY){
						temp += "," + subjectArr[k].attr('.label/text');
						subjExist = true;
						break;
					}
				}
				if(i == 19 && subjExist) exp+=temp+"\r\n"
			}
			year++; //after 2 sems, increment year
		}
	}

	exp+="\r\n"
	for(course in curriculum){
		for(target in curriculum[course]) exp+= course.replace(" ","")+","+(curriculum[course][target]).replace(" ","")+"\r\n";
	}
	return exp;
}

function importCSV(){
	import_flag = true;
    clearCanvas();
    console.log(csv)
    csv = csv.replace(/\r\n/g,"\n");
	var importString = csv.split("\n\n");
    console.log(importString);

	//ADD THE SUBJECTS IN THE DIAGRAM
	var sems = importString[0].split("\n");

    //MATCH YEARS IN DIAGRAM WITH IMPORTED CURRICULUM
    var temp = sems[sems.length-1].split(","); //last semester in the imported curriculum
    temp = temp[0].split("-");

    console.log(temp);
    if(temp[0] != yearCount) changeYear(temp[0]);


	// document.getElementById('edit-tab-department').value = sems[0];
	document.getElementById('edit-tab-degree').value = sems[1];
	document.getElementById('edit-tab-curriculum-code').value = sems[2];
	document.getElementById('dept_opts').value = sems[0];

	code = sems[2];

	for(m=3; m<sems.length; m++){
		var subjects = sems[m].split(",");
		var year_sem = subjects[0].split("-");
		for(n=1; n<subjects.length; n++){
			addSubject(subjects[n], year_sem[0], year_sem[1]);
		}
	}

	//CONNECT THE PREREQUISITES
	var dependencies = importString[1].split("\n");
	for(i=0; i<dependencies.length; i++){
		var temp = dependencies[i].split(","); //[0] is source, [1] is target
		var sourceLink;
		var targetLink;
		for(j=0; j<subjectArr.length; j++) if(temp[0] == subjectArr[j].id.replace(" ","")) sourceLink = subjectArr[j].id;
		for(j=0; j<subjectArr.length; j++) if(temp[1] == subjectArr[j].id.replace(" ","")) targetLink = subjectArr[j].id;
		var link =  new joint.dia.Link({
			source: { id: sourceLink, port: 'out' },
			target: { id: targetLink, port: 'in' },
			router: { name: 'manhattan' },
			connector: { name: 'rounded' },
			attrs: {
				'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
				'.connection': { 'stroke-width': 2 }
			}
		});

		graph.addCell(link);
		if(Math.abs(link.getSourceElement().attributes.position.x - link.getTargetElement().attributes.position.x) > (gridWidth + gridWidth/2)){
			link.set('router', { name: 'manhattan' } );
		}  else {
			link.unset('router');
		}
		if(curriculum[sourceLink] == null) curriculum[sourceLink] = [];
		curriculum[sourceLink].push(targetLink);
	}
	import_flag = false;
}

function addSubject(course, year, sem){
	if(year != null && course != null){
		var courseName = course;
	} else if(year == null && course != null){
		var courseName = course.value;
		$('#modal-add-course').closeModal();
	} else{
//		var courseName = course.innerHTML;
		var temp = document.getElementById("add-subject-drop")
		var courseName = temp.options[temp.selectedIndex].innerHTML;
	}
	var not_import = import_flag;
	//convert post-fix to infix
	$.ajax({
		        url: '/courses/find/' + courseName,
		        type: 'get',
		        success: function(data) {
	    			var stack = [];
    				var tokens = data[0].prerequisite.split("+");
    				var output = "";

    				for(var token = tokens.length-1; token > -1; token--)
        				stack.push(tokens[token])

        			output = convert(stack);
        			if(!not_import){
        				Materialize.toast(courseName +" prerequisites : " +output, 5000);
        				if(data[0].corequisite != "NONE") Materialize.toast(courseName +" corequisite : " +data[0].corequisite, 5000);
        			}
	 	        },
		        error: function(e) {
		            console.log(e.message);
		        }
		    });

	var shapeHeight = gridWidth/4;
	var initX = 0;
	var initY = 0;
	var availablePos = false;
	var portSize = 10;
	var yPos = .33

	if(year != null){
		if(sem == 3) initX = (gridWidth * (year*2-1)) + gridWidth/2;
		else initX = gridWidth * (year*2-(Math.pow(sem,-1)*2));
	}

	if(subjectArr.length > 0){
		for(j=0; j<yearCount*2; j++){ //check for available positions
			for(i=0; i<20; i++){
				var temp = courseName.split("(");
				if(year == null) initX = gridWidth * j;
				if(sem == 3) initY = gridWidth/2 * (i+8);
				else if(temp[0] == "GE") initY = gridWidth/2 * (i+10);
				else initY = gridWidth/2 * i;
				for(k=0; k<subjectArr.length; k++){
					if(subjectArr[k].attributes.position.x == initX && subjectArr[k].attributes.position.y == initY) break;
					if(k == (subjectArr.length-1)) availablePos = true;
				}
				if(availablePos) break;
			}
			if(availablePos) break;
		}
	}
	var subjectName = courseName
	if(window.innerWidth < 992){ //responsiveness
		shapeHeight = gridWidth/5;
		portSize = 4;
		yPos = .1;
	}

	if(courseName.length > 12){
		shapeHeight *= 2;
		var wraptext = joint.util.breakText(courseName, {
			width: semDivider*1.5,
			height: shapeHeight*2
		});
		subjectName = wraptext;
	}

// if(window.innerWidth < 992) wraptext = courseName;

	var subject = new joint.shapes.devs.Model({
		position: { x: initX, y: initY },
		size: { width: semDivider, height: shapeHeight },
		inPorts: ['in'],
		outPorts: ['out'],
		attrs: {
        '.label': { text: subjectName, 'ref-x': .5, 'ref-y': yPos },
				rect: { fill: '#42a5f5', stroke: 0 },
				'.inPorts circle': { fill: '#bdbdbd', r: portSize, magnet: 'passive', type: 'input', stroke: 0 },
				'.outPorts circle': { fill: '#bdbdbd',r: portSize, type: 'output', stroke: 0}
		}
	});
	var tempId = courseName.split("(");
	var tempId2 = courseName.split(" ");
	if(tempId[0] != "GE" && tempId2[0] != "PE" && courseName.trim() != "SPECIALIZED" && courseName.trim() != "MAJOR" && courseName.trim() != "ELECTIVE")
		subject.set({ id: courseName });
	else
		subject.attr({'.inPorts circle': { r:0 }, '.outPorts circle': { r: 0, magnet: 'passive' } })

	if(tempId[0] == "GE" || tempId2[0] == "GE") subject.attr({rect: { fill: '#ffcc80'}});
	else if(tempId2[0] == "PE") subject.attr({rect: { fill: '#b39ddb'}});
	else if(tempId2[0] == "NSTP") subject.attr({rect: { fill: '#ff8a80'}});
	else if(courseName.trim() == "SPECIALIZED") subject.attr({rect: { fill: '#b2ff59'}});
	else if(courseName.trim() == "ELECTIVE") subject.attr({rect: { fill: '#fff176'}});

	var existing = false;
	for(i=0; i<subjectArr.length; i++){
		if(subjectArr[i].id == courseName) existing = true;
	}

	if(!existing){
		subjectContainer.embed(subject);
		graph.addCell(subject);
		subjectArr.push(subject);
	}

//	document.getElementById("courseCode").value = ""; //remove value
	colCount += 1;
	if(colCount%6 == 0){
		rowCount += 1;
		colCount = 0;
	}
}

function convert(input) {
	var stack = [];

    var tokens = input.split("+");

    for(var token = tokens.length-1; token > -1; tokens--)
        stack.push(tokens[token]);

    console.log(stack);

}

//file IO
var upload = document.getElementById('import-csv');
upload.addEventListener('change', fileSelect, false);

function fileSelect(evt) {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
  		// Great success! All the File APIs are supported.
	} else {
  		alert('The File APIs are not fully supported in this browser.');
	}

	var files = document.getElementById('import-csv').files;
	var file = files[0];

	var reader = new FileReader();

	reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      	var data = evt.target.result;

      	csv = data.replace(/%0A/g,"\r\n").replace(/%20/g," ");
        importCSV();
      }
    };
    reader.readAsText(file);
}

function showComments(type) {
    var commentsMap = {};
    if(type === 'course') {
	    var target = "view-comments-area";
	    var container = document.getElementById(target);
	    container.innerHTML = "";

	    $.ajax({
	        url: '/comments/course/' + selectedSubject.id,
	        type: 'get',
	        success: function(data) {
	            for(var key in data) {
	                var content =  "<div class='comment-div col s12'>";
	                content+= "<label class='comment-email blue-text text-lighten-1'>"+ data[key].author + "</label>: " + data[key].text +"</div>";
	                container.innerHTML = container.innerHTML + content;
	            }
	        },
	        error: function(e) {
	            console.log(e.message);
	        }
	    });
	} else {
		var target = "tab-comment-div-inside";
	    var container = document.getElementById(target);
	    container.innerHTML = "";

	    $.ajax({
	        url: '/comments/curriculum/' + loaded_curriculum.code,
	        type: 'get',
	        success: function(data) {
	            for(var key in data) {
	                var content = '<div class="comment-div col s12">';
					content += '<label class="blue-text text-lighten-1">'+data[key].author+'</label>';
					content += '<span>: '+data[key].text+'</span>';
					content += '</div>';
					container.innerHTML = container.innerHTML + content;
	            }
	        },
	        error: function(e) {
	            console.log(JSON.stringify(e));
	        }
	    });
	}
}

function getSemester(subject){
	for(i=0; i<yearCount*2; i++){ //traverse through subject array
		if(subject.attributes.position.x == gridWidth*i){ //if x coordinate matches sem column
			if(i%2 == 0) return '1' //first sem starts at index 0
			else return '2';
		} else if(i%2 == 1 && subject.attributes.position.x == gridWidth*i + gridWidth/2){
			return 'S';
		}
	}
}

function downloadCSV() {
	csv_file = exportCSV().replace(/\n/g,"%0A");
	csv_file = csv_file.replace(/ /g,"%20");

	var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' +  csv_file;
    a.target      = '_blank';
    a.download    = code + '.csv';

    document.body.appendChild(a);
    a.click();
}