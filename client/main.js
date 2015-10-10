var fabricCanvas;

function resizeCanvas() {
	console.log("New Window:", window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas, false);


Template.drawCanvas.onRendered(function() {
	fabricCanvas = new fabric.Canvas('draw-canvas', {
		isDrawingMode: true
	});
})

Template.drawCanvas.events({
	'click #draw-canvas': function() {

	}
})
