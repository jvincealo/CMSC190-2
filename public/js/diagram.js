
var curriculum = {}; //json for the curriculum
var coursePos = {}; //save positions
var colCount = 0;
var rowCount = 0;
var graphScale = 1;
var selectedSubject = null;


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
//    		connector: { name: 'rounded' },
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
paper.setOrigin(xMax/7.5, yMax/20);
zoomPaper(-0.5);

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
paper.on('blank:pointerclick', function(evt, x, y){
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
            $('label').addClass('active');
            document.getElementById('courseCode').value = courses[i]["code"];
            document.getElementById('courseTitle').value = courses[i]["title"];
            document.getElementById('prerequisite').value = courses[i]["prerequisite"];
            document.getElementById('units').value = courses[i]["units"];
            document.getElementById('course-info').value = courses[i]["description"];
        });
});

graph.on('change:source change:target', function(link) { // CONNECTING SUBJECT - linking event handler
    if (link.get('source').id && link.get('target').id) { //if 2 subjects are connected
			var sourceId = link.get('source').id;
			var targetId = link.get('target').id;
			if(curriculum[sourceId] == null) curriculum[sourceId] = targetId;
			else curriculum[sourceId] += "," + targetId;
			console.log(curriculum);
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
});

function dragPaper(){
	if(dragFlag){
		paper.setOrigin(
			event.offsetX - dragStartPosition.x,
			event.offsetY - dragStartPosition.y);
	}
}
function addCourse(course){
	if(course.value != null){
	 	var courseName = course.value;
		$('#modal-add-course').closeModal();
	} else{
		var courseName = course.innerHTML;
	}

	// Create a custom element.
	// ------------------------
	joint.shapes.html = {};
	joint.shapes.html.Element = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
			markup: '<g class="rotatable"><g class="scalable"><rect/></g><g class="inPorts"/><g class="outPorts"/></g>',
			portMarkup: '<g class="port<%= id %>"><circle/></g>',
			defaults: joint.util.deepSupplement({
					type: 'html.Element',
					size: { width: 100, height: 80 },
					inPorts: [],
					outPorts: [],
					attrs: {
							'.': { magnet: false },
							rect: {
									stroke: 'none', 'fill-opacity': 0, width: 150, height: 250,
							},
							circle: {
									r: 6, //circle radius
									magnet: true,
									stroke: 'black'
							},

							'.inPorts circle': { fill: 'green', magnet: 'passive', type: 'input'},
							'.outPorts circle': { fill: 'red', type: 'output'}
					}
			}, joint.shapes.basic.Generic.prototype.defaults),
			getPortAttrs: function (portName, index, total, selector, type) {

					var attrs = {};
					var portClass = 'port' + index;
					var portSelector = selector + '>.' + portClass;
					var portCircleSelector = portSelector + '>circle';
					attrs[portCircleSelector] = { port: { id: portName || _.uniqueId(type), type: type } };
					attrs[portSelector] = { ref: 'rect', 'ref-y': (index + 0.5) * (1 / total) };
					if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }
					return attrs;
			}
	}));

	joint.shapes.html.ElementView = joint.dia.ElementView.extend({
		template: [
				'<div class="html-element valign-wrapper" id="'+courseName.replace(" ","")+'" onmouseover="">',
				'<button class="delete">x</button>',
				'<label class="valign center-align"></label>',
				'</div>'
		].join(''),

		initialize: function() {
			_.bindAll(this, 'updateBox');
			joint.dia.ElementView.prototype.initialize.apply(this, arguments);

			this.$box = $(_.template(this.template)());
			this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
			// Update the box position whenever the underlying model changes.
			this.model.on('change', this.updateBox, this);
			// Remove the box when the model gets removed from the graph.
			this.model.on('remove', this.removeBox, this);

			this.updateBox();
       this.listenTo(this.model, 'process:ports', this.update);
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    },


     render: function() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        // this.paper.$el.mousemove(this.onMouseMove.bind(this)), this.paper.$el.mouseup(this.onMouseUp.bind(this));
        this.updateBox();
        return this;
    },

    renderPorts: function () {
        var $inPorts = this.$('.inPorts').empty();
        var $outPorts = this.$('.outPorts').empty();

        var portTemplate = _.template(this.model.portMarkup);

        _.each(_.filter(this.model.ports, function (p) { return p.type === 'in' }), function (port, index) {
            $inPorts.append(V(portTemplate({ id: index, port: port })).node);
        });
        _.each(_.filter(this.model.ports, function (p) { return p.type === 'out' }), function (port, index) {
            $outPorts.append(V(portTemplate({ id: index, port: port })).node);
        });
    },

    update: function () {
        // First render ports so that `attrs` can be applied to those newly created DOM elements
        // in `ElementView.prototype.update()`.
        this.renderPorts();
        joint.dia.ElementView.prototype.update.apply(this, arguments);
    },
		updateBox: function() {
			// Set the position and dimension of the box so that it covers the JointJS element.
			var bbox = this.model.getBBox();
			// Example of updating the HTML with a data stored in the cell model.
			this.$box.find('label').text(this.model.get('label'));
			this.$box.find('span').text(this.model.get('select'));
			this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
		},
		removeBox: function(evt) {
			this.$box.remove();
		}
	});

	// Create JointJS elements and add them to the graph as usual.
	var subject = new joint.shapes.html.Element({
		position: { x: 80, y: 80 },
		size: { width: 100, height: 50 },
		inPorts: ['in'],
    outPorts: ['out'],
		label: courseName
	});

	graph.addCells([subject]);
//	document.getElementById("courseCode").value = null; //remove value
//	graph.addCells([subject, subject2, l]);
}

function addSubject(course){
	if(course != null){
		var courseName = course.value;
		$('#modal-add-course').closeModal();
	} else{
//		var courseName = course.innerHTML;
		var temp = document.getElementById("add-subject-drop")
		var courseName = temp.options[temp.selectedIndex].innerHTML;
	}
	var subject = new joint.shapes.devs.Model({
		id: courseName,
		position: { x: semDivider*rowCount, y: (semDivider/2)*(colCount+1) },
		size: { width: semDivider, height: yMax/12 },
		inPorts: [''],
		outPorts: [''],
		attrs: {
        '.label': { text: courseName, 'ref-x': .5, 'ref-y': .33 },
				rect: { fill: '#42a5f5' },
				'.inPorts circle': { fill: '#E74C3C', r: 10, magnet: 'passive', type: 'input' },
				'.outPorts circle': { fill: '#16A085',r: 10, type: 'output' }
		}
	});
//	subject.attr({ rect: { fill: 'red' } });
	graph.addCell(subject);
//	document.getElementById("courseCode").value = ""; //remove value
	colCount += 1;
	if(colCount%6 == 0){
		rowCount += 1;
		colCount = 0;
	}
}


//REMOVE COMMENT IN LINE 320 KUNG GAGAMITIN MO TO
//COMMENT OUT LINE 313 - 319
//addSubject("MATH 17");
//addSubject("MATH 26");
//addSubject("MATH 27");
//addSubject("MATH 28");
//addSubject("STAT 1");
//addSubject("CMSC 11");
//addSubject("CMSC 56");
//addSubject("CMSC 21");
//addSubject("CMSC 57");
//addSubject("CMSC 130");
//addSubject("CMSC 131");
//addSubject("CMSC 132");
//addSubject("CMSC 199");
//addSubject("CMSC 198");
//addSubject("CMS 2");
//addSubject("CMSC 22");
//addSubject("CMSC 100");
//addSubject("CMSC 125");
//addSubject("CMSC 137");
//addSubject("CMSC 123");
//addSubject("CMSC 124");
//addSubject("CMSC 128");
//addSubject("CMSC 141");
//addSubject("CMSC 142");
//addSubject("CMSC 127");
//addSubject("CMSC 170");
//addSubject("CMSC 150");

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