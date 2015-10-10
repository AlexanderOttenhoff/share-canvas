var fabricCanvas;

Template.drawCanvas.onRendered(function() {
	var canvas = $("#draw-canvas");
	fabricCanvas = new fabric.Canvas('draw-canvas', {
		isDrawingMode: true
	})
})

Template.drawCanvas.events({
	'click #draw-canvas': function() {

	}
})
