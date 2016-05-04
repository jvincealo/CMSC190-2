var csv = "MATH17,CMSC56\nMATH17,CMSC11\nMATH17,STAT1\nMATH26,MATH27\nMATH26,CMSC150\nMATH27,MATH28\nCMSC56,CMSC57\nCMSC57,CMSC130\nCMSC57,CMSC123\nCMSC21,CMSC123\nCMSC21,CMSC131\nCMSC11,CMSC21\nCMSC11,CMSC22\nCMSC11,CMSC130\nCMSC2,CMSC100\nCMSC22,CMSC100\nCMSC123,CMSC127\nCMSC123,CMSC170\nCMSC123,CMSC124\nCMSC123,CMSC125\nCMSC123,CMSC128\nCMSC123,CMSC141\nCMSC123,CMSC142\nCMSC123,CMSC150\nCMSC125,CMSC137\nCMSC131,CMSC132";

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
    size: { width: gridWidth*8, height: containerHeight+semDivider/4 },
    attrs: { rect: { style: {'pointer-events': 'none'}} }
});
graph.addCell(subjectContainer);
paper.setOrigin(semDivider/2,(semDivider/4));
zoomPaper(-0.5);
//grid columns for years and semesters
for (i = 0; i <= yearCount*2; i++) { 
	var line = V('line', { x1: gridWidth*i-(semDivider/4), y1: 0-semDivider/4, x2: gridWidth*i-(semDivider/4), y2: containerHeight, stroke: 'black' });
	V(paper.viewport).append(line);
}

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


//grid columns for years and semesters
for (i = 0; i <= yearCount*2; i++) {
	var line = V('line', { x1: gridWidth*i-(semDivider/4), y1: 0, x2: gridWidth*i-(semDivider/4), y2: yMax*2, stroke: 'black' });
	V(paper.viewport).append(line);
}
var line = V('line', { x1: 0-(semDivider/4), y1: 0, x2: (xMax*3)/2-(semDivider/4), y2: 0, stroke: 'black' });
V(paper.viewport).append(line);
var line2 = V('line', { x1: 0-(semDivider/4), y1: yMax*2, x2: (xMax*3)/2-(semDivider/4), y2: yMax*2, stroke: 'black' });
V(paper.viewport).append(line2);


$('#diagram-container').bind('mousewheel', function(event) {
		event.preventDefault(); //disable scroll through mousewheel
    if (event.originalEvent.wheelDelta >= 0) {
        console.log('Scroll up');
				zoomPaper(0.05);
    }
    else {
        console.log('Scroll down');
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
		selectedSubject.attr({ rect: { 'stroke-width': 0 } });
		selectedSubject.remove();
		selectedSubject = null;
	}
}

function dragPaper(){ //scrolls paper on drag
	if(dragFlag){
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
     $(document).ready(function(){
            //search function
            var index = -1;
            for(var i=0; i<courses.length;i++) {
                if(courses[i]["code"] == evt.model.id) {
                    index = i;
                    break;
                }
            }

            $('ul.tabs').tabs('select_tab', 'tab-info');
            document.getElementById('code').innerHTML = courses[i]["code"];
            document.getElementById('title').innerHTML = courses[i]["title"];
            document.getElementById('prerequisite').innerHTML = courses[i]["prerequisite"];
            document.getElementById('units').innerHTML = courses[i]["units"];
            document.getElementById('description').innerHTML = courses[i]["description"];
        });
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

function exportCSV(){
	var subjects = graph.getElements();
	for (i = 0; i <= yearCount*2; i++) {
			console.log("Column "+(i+1));
		for(j = 0; j<subjects.length; j++){
			if(subjects[j].attributes.position.x == gridWidth*i) console.log(subjects[j].id);
		}
	}
	console.log("DEPENDENCIES:"); //ETO YUNG PREREQUISITES
	for(course in curriculum){
		for(target in curriculum[course]) console.log(course+","+curriculum[course][target]);
	}
}
function importCSV(){
//	var csv = document.getElementById("import-csv");
//	console.log("File String is:");
//	console.log(csv.value);
//	console.log(csv);
//	curriculum[sourceId].push(targetId);
	var dependencies = csv.split("\n");
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
	}

	
	

}
function dragPaper(){
	if(dragFlag){
		paper.setOrigin(
			event.offsetX - dragStartPosition.x,
			event.offsetY - dragStartPosition.y);
	}
}

function addSubject(course){
//	if(course != null){
//		var courseName = course.value;	
//		$('#modal-add-course').closeModal();
//	} else{
////		var courseName = course.innerHTML;
//		var temp = document.getElementById("add-subject-drop")
//		var courseName = temp.options[temp.selectedIndex].innerHTML;
//	} 
	var courseName = course; 
	var shapeHeight = yMax/12;
	var initX = 0;
	var initY = 0;
	var availablePos = false;
	
	if(subjectArr.length > 0){
		for(j=0; j<yearCount*2; j++){ //check for available positions
			for(i=0; i<20; i++){
				initX = gridWidth * j;
				initY = gridWidth/2 * i;
				for(k=0; k<subjectArr.length; k++){
					if(subjectArr[k].attributes.position.x == initX && subjectArr[k].attributes.position.y == initY) break;
					if(k == (subjectArr.length-1)) availablePos = true;
				}
				if(availablePos) break;
			}
			if(availablePos) break;
		}
	}
	
	if(courseName.length > 12) shapeHeight = yMax/6;
	var wraptext = joint.util.breakText(courseName, {
    width: semDivider,
    height: shapeHeight
	});
	var subject = new joint.shapes.devs.Model({
		id: courseName.replace(" ",""),
		position: { x: initX, y: initY },
		size: { width: semDivider, height: shapeHeight },
		inPorts: ['in'],
		outPorts: ['out'],
		attrs: {
        '.label': { text: wraptext, 'ref-x': .5, 'ref-y': .33 },
				rect: { fill: '#42a5f5', stroke: 0 },
				'.inPorts circle': { fill: '#e0e0e0', r: 10, magnet: 'passive', type: 'input', stroke: 0 },
				'.outPorts circle': { fill: '#e0e0e0',r: 10, type: 'output', stroke: 0}
		}
	});
//	subject.attr({ rect: { fill: 'red' } });
	subjectContainer.embed(subject);
	graph.addCell(subject);
	subjectArr.push(subject);

//	document.getElementById("courseCode").value = ""; //remove value
	colCount += 1;
	if(colCount%6 == 0){ 
		rowCount += 1;
		colCount = 0;
	}
}

//File IO
var upload = document.getElementById('upload');
upload.addEventListener('change', fileSelect, false);

$(function(){
    $("#upload_link").on('click', function(e){
        e.preventDefault();
        $("#upload:hidden").trigger('click');
    });
});

function fileSelect(evt) {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
  		// Great success! All the File APIs are supported.
	} else {
  		alert('The File APIs are not fully supported in this browser.');
	}

	var files = document.getElementById('upload').files;
	var file = files[0];

	var reader = new FileReader();

	reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      	var data = evt.target.result;
      	var lines = data.split('\n');
      	var tokens;

      	for(var line = 0; line < lines.length ; line++) {
      		tokens = lines[line].split(',');
      		for(var token = 0; token < tokens.length; token++) {
      			curriculum[tokens[token]] = tokens[token+1];
      		}
      	}
      }
    };
    reader.readAsText(file);
}

//exports curriculum as CSV
function exportCSV(){
    var subjects = graph.getElements();
    var code = "BSCS-2009";
    var department = "ICS";
    var title = "BS Computer Science (rev. 2009)";

    var csv_data = [];
    var year = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIX"];
    var sem = ["FIRST", "SECOND"];

    csv_data.push([code,department,title].join(','));
    var sf = 0;
    var yf = 0;
    for (i = 0; i < yearCount*2; i++) {
        var row_data = [code,year[yf],sem[sf]];
        for(j = 0; j<subjects.length; j++){
            if(subjects[j].attributes.position.x == gridWidth*i)  {
                row_data.push(subjects[j].id);
            }
        }
        csv_data.push(row_data.join(','));
        if(sf == 1)
            yf++;

        if(sf == 0)
            sf = 1;
        else
            sf = 0;
    }

    var csv_file = csv_data.join("%0A");
    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' +  csv_file;
    a.target      = '_blank';
    a.download    = code + '.csv';

    document.body.appendChild(a);
    a.click();
}

function saveToAccount() {
    var subjects = graph.getElements();
    var code = "BSCS-2009";
    var department = "ICS";
    var title = "BS Computer Science (rev. 2009)";

    var csv_data = [];
    var year = ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIX"];
    var sem = ["FIRST", "SECOND"];

    csv_data.push([code,department,title].join(','));
    var sf = 0;
    var yf = 0;
    for (i = 0; i < yearCount*2; i++) {
        var row_data = [code,year[yf],sem[sf]];
        for(j = 0; j<subjects.length; j++){
            if(subjects[j].attributes.position.x == gridWidth*i)  {
                row_data.push(subjects[j].id);
            }
        }
        csv_data.push(row_data.join(','));
        if(sf == 1)
            yf++;

        if(sf == 0)
            sf = 1;
        else
            sf = 0;
    }

    var csv_file = csv_data.join("%0A");
    var request = {
        author: user_id,
        csv: csv_file,
        code: code,
        department: department,
        title: title
    }
    $.get("/curriculum",
        function(data, status){
            alert(JSON.stringify(data));
        }
    );
}

addSubject("MATH 17");
addSubject("MATH 26");
addSubject("MATH 27");
addSubject("MATH 28");
addSubject("STAT 1");
addSubject("CMSC 11");
addSubject("CMSC 56");
addSubject("CMSC 21");
addSubject("CMSC 57");
addSubject("CMSC 130");
addSubject("CMSC 131");
addSubject("CMSC 132");
addSubject("CMSC 199");
addSubject("CMSC 198");
addSubject("CMSC 2");
addSubject("CMSC 22");
addSubject("CMSC 100");
addSubject("CMSC 125");
addSubject("CMSC 137");
addSubject("CMSC 123");
addSubject("CMSC 124");
addSubject("CMSC 128");
addSubject("CMSC 141");
addSubject("CMSC 142");
addSubject("CMSC 127");
addSubject("CMSC 170");
addSubject("CMSC 150");