var csv =
		"1-1,PE 1,MATH 17,ENG 1(AH),GE(SSP),GE(MST),GE(SSP)\n1-2,PE 2,CMSC 2,CMSC 11,CMSC 56,MATH 26,ENG 2(AH),GE(MST)\n2-1,NSTP 1,PE 2,CMSC 21,CMSC 57,MATH 27,STAT 1,GE(AH),GE(MST)\n2-2,NSTP 2,PE 2,CMSC 22,CMSC 123,CMSC 130,MATH 28,GE(MST),GE(SSP)\n3-1,CMSC 100,CMSC 124,CMSC 127,CMSC 131,SPCM 1(AH),ELECTIVE\n3-2,CMSC 125,CMSC 128,CMSC 132,CMSC 170,ENG 10,ELECTIVE\n3-3,CMSC 198\n4-1,CMSC 137,CMSC 141,CMSC 150,CMSC 190-1,CMSC 199,GE(SSP),ELECTIVE\n4-2,CMSC 142,CMSC 190-2,PI 10(SSP),GE(MST),GE(AH),ELECTIVE\n\nMATH17,CMSC56\nMATH17,CMSC11\nMATH17,STAT1\nMATH26,MATH27\nMATH26,CMSC150\nMATH27,MATH28\nCMSC56,CMSC57\nCMSC57,CMSC130\nCMSC57,CMSC123\nCMSC21,CMSC123\nCMSC21,CMSC131\nCMSC11,CMSC21\nCMSC11,CMSC22\nCMSC11,CMSC130\nCMSC2,CMSC100\nCMSC22,CMSC100\nCMSC123,CMSC127\nCMSC123,CMSC170\nCMSC123,CMSC124\nCMSC123,CMSC125\nCMSC123,CMSC128\nCMSC123,CMSC141\nCMSC123,CMSC142\nCMSC123,CMSC150\nCMSC125,CMSC137\nCMSC131,CMSC132";

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
					'.connection': { 'stroke-width': 4 }
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
paper.setOrigin((xMax-gridWidth*yearCount)/2,(semDivider/4));
zoomPaper(-0.5);
//grid columns for years and semesters
for (i = 0; i <= yearCount*2; i++) {
	var line = V('line', { x1: gridWidth*i-(semDivider/4), y1: 0-semDivider/4, x2: gridWidth*i-(semDivider/4), y2: containerHeight, stroke: 'black', 'stroke-width': 3 });
	V(paper.viewport).append(line);
}
var line = V('line', { x1: 0-(semDivider/4), y1: 0-semDivider/4, x2: gridWidth*8-(semDivider/4), y2: 0-semDivider/4, stroke: 'black', 'stroke-width': 3 });
var line2 = V('line', { x1: 0-(semDivider/4), y1: containerHeight+semDivider/4-semDivider/4, x2: gridWidth*8-(semDivider/4), y2: containerHeight+semDivider/4-semDivider/4, stroke: 'black', 'stroke-width': 3 });
V(paper.viewport).append(line);
V(paper.viewport).append(line2);

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
		selectedSubject.attr({ rect: { 'stroke-width': 1 } });
		selectedSubject = null;
	}
});

paper.on('cell:pointerclick', function(evt, x, y) { //selects and highlights clicked subject
	if(selectedSubject != null){
		selectedSubject.attr({ rect: { 'stroke-width': 1 } });
		selectedSubject = null;
	}
	selectedSubject = evt.model;
	evt.model.attr({ rect: { stroke: 'black', 'stroke-width': 3 } });
});
paper.on('cell:pointerdblclick', function(evt, x, y) { // CHANGE TO INFO TAB - dbclick subject event handler
//     $(document).ready(function(){
//			$('ul.tabs').tabs('select_tab', 'tab-info');
//		});
//		console.log(evt.model.id);
	console.log(subjectArr[0].attributes.position.x+","+subjectArr[0].attributes.position.y);
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
			if(curriculum[sourceId] == null){
					curriculum[sourceId] = [];
					curriculum[sourceId].push(targetId);
			} else {
					if(jQuery.inArray(targetId , curriculum[sourceId]) == -1) curriculum[sourceId].push(targetId);
			}
		}
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

function clearCanvas(){
	graph.clear();
	curriculum = {};
	subjectArr = [];
	graph.addCell(subjectContainer);
}
function exportCSV(){
	var temp = "";
	var year = 1;
	var tempX, tempY;
	var subjExist = false;
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
			if(i == 19 && subjExist) console.log(temp);
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
				if(i == 19 && subjExist) console.log(temp);
			}
			year++; //after 2 sems, increment year
		}
	}

	console.log("\nPREREQUISITES:");
	for(course in curriculum){
		for(target in curriculum[course]) console.log(course+","+curriculum[course][target]);
	}
}
function importCSV(){
	var importString = csv.split("\n\n");

	//ADD THE SUBJECTS IN THE DIAGRAM
	var sems = importString[0].split("\n");
	for(m=0; m<sems.length; m++){
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
		for(j=0; j<subjectArr.length; j++) if(temp[0] == subjectArr[j].id) sourceLink = subjectArr[j].id;
		for(j=0; j<subjectArr.length; j++) if(temp[1] == subjectArr[j].id) targetLink = subjectArr[j].id;
		var link =  new joint.dia.Link({
			source: { id: sourceLink, port: 'out' },
			target: { id: targetLink, port: 'in' },
			router: { name: 'manhattan' },
			connector: { name: 'rounded' },
			attrs: {
				'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
				'.connection': { 'stroke-width': 4 }
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
				if(year == null) initX = gridWidth * j;
				if(sem == 3) initY = gridWidth/2 * 10;
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
	if(tempId[0] != "GE" && tempId2[0] != "PE") subject.set({ id: courseName.replace(" ","") });
	var existing = false;
	for(i=0; i<subjectArr.length; i++){
		if(subjectArr[i].id == courseName.replace(" ","")) existing = true;
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
