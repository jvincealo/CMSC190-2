var curriculum = {}; //json for the curriculum

var yearCount = 4; //default no. of years
var xMax = $('#diagram-container').width();
var yMax = $('#diagram-container').height();
var semDivider = xMax/(yearCount*2);
var dragFlag = false; //scroll paper on mouse drag
var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
		el: $('#diagram-container'),
		width: xMax*2,
		height: yMax*2,
		model: graph,
		gridSize: semDivider/(yearCount*2),
		defaultLink: new joint.dia.Link({
				attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
		}),
//		snapLinks: { radius: 75 }
});

for (i = 1; i < yearCount*4; i++) {
	var line = V('line', { x1: semDivider*i, y1: 0, x2: semDivider*i, y2: yMax*2, stroke: 'black' });
	V(paper.viewport).append(line);
}

//var cell = new joint.shapes.devs.Atomic({
//    position: { x: 400, y: 150 },
//    size: { width: 100, height: 100 }
//});
//graph.addCells([cell]);

paper.on('blank:pointerdown', function(evt, x, y){ //drag paper on press
		dragFlag = true;
		dragStartPosition = { x: x, y: y};
});

paper.on('blank:pointerup', function(evt, x, y){ //stop drag paper after press
		dragFlag = false;
		delete dragStartPosition;
});

paper.on('cell:pointerdblclick', function(evt, x, y) { // CHANGE TO INFO TAB - dbclick subject event handler
     $(document).ready(function(){
			$('ul.tabs').tabs('select_tab', 'tab-info');
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
//		console.log(outSubj);
		outSubj.forEach(function(link) {
		if(link.getSourceElement().attributes.position.x >= link.getTargetElement().attributes.position.x){
			link.attr({
				'.connection': { stroke: 'red' },
				'.marker-target': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }
			});
			console.log("error");
		} else {
			link.attr({
				'.connection': { stroke: 'black' },
				'.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
			});
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
	if(course.value != null){
		var courseName = course.value;
		$('#modal-add-course').closeModal();
	} else{
		var courseName = course.innerHTML;
	}

	var subject = new joint.shapes.devs.Model({
		id: courseName.replace(" ",""),
		position: { x: 50, y: 50 },
		size: { width: 100, height: 50 },
		inPorts: [''],
		outPorts: [''],
		attrs: {
        '.label': { text: courseName, 'ref-x': .5, 'ref-y': .33 },
				rect: { fill: '#42a5f5' },
				'.inPorts circle': { fill: '#E74C3C' },
				'.outPorts circle': { fill: '#16A085' }
		}
	});
	graph.addCell(subject);
//	document.getElementById("courseCode").value = ""; //remove value
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
      alert(JSON.stringify(curriculum,null,2));
    };
    reader.readAsText(file);
}