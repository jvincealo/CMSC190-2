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
            document.getElementById('code').innerHTML = courses[i]["code"];
            document.getElementById('title').innerHTML = courses[i]["title"];
            document.getElementById('prerequisite').innerHTML = courses[i]["prerequisite"];
            document.getElementById('units').innerHTML = courses[i]["units"];
            document.getElementById('description').innerHTML = courses[i]["description"];
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
}

function addSubject(course){
	if(course != null){
		var courseName = course.value;
		$('#modal-add-course').closeModal();
	} else{
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
	graph.addCell(subject);
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
    $.post("/curriculum", request,
        function(data, status){
            alert(data["message"]);
        }
    );
}