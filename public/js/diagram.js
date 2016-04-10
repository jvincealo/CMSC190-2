var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
		el: $('#diagram-container'),
		width: $('#diagram-container').width(),
		height: $('#diagram-container').height(),
		model: graph,
		gridSize: 1
});

//var rect = new joint.shapes.basic.Rect({
//		position: { x: 100, y: 30 },
//		size: { width: 100, height: 30 },
//		attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
//});
//
//var rect2 = rect.clone();
//rect2.translate(300);
//
//var link = new joint.dia.Link({
//		source: { id: rect.id },
//		target: { id: rect2.id }
//});
//
//graph.addCells([rect, rect2, link]);


// CREATE NEW CUSTOM ELEMENT
joint.shapes.html = {};
joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
		defaults: joint.util.deepSupplement({
				type: 'html.Element',
		}, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.html.ElementView = joint.dia.ElementView.extend({
	template: [
			'<div class="html-element">',
			'<button class="delete">x</button>',
			'<label></label>',
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
			},
		render: function() {
			joint.dia.ElementView.prototype.render.apply(this, arguments);
			this.paper.$el.prepend(this.$box);
			this.updateBox();
			return this;
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

function addCourse(){
	// Create JointJS elements and add them to the graph as usual.
	// -----------------------------------------------------------
	var courseName = document.getElementById("courseCode").value;
	var subject = new joint.shapes.html.Element({ position: { x: 80, y: 80 }, size: { width: 100, height: 50 }, label: courseName });
//	var subject2 = new joint.shapes.html.Element({ position: { x: 370, y: 160 }, size: { width: 100, height: 50 }, label: 'CMSC 141'});
//	var l = new joint.dia.Link({
//			source: { id: subject.id },
//			target: { id: subject2.id },
//			attrs: {
//				'.connection': { stroke: 'black' },
//				'.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
//			}
//	});
graph.addCells([subject]);
//	graph.addCells([subject, subject2, l]);
}



