// var fabricCanvas;

function resizeCanvas() {
	console.log("New Window:", window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas, false);


Template.drawCanvas.onRendered(function() {
	fabricCanvas = new fabric.Canvas('draw-canvas', {
		isDrawingMode: true
	});

	fabricCanvas.observe("mouse:move", function(e) {
		var buttons = e.e.buttons;
		if (e.e.buttons & 1) {
			console.log("move", e.e.x, e.e.y);
		}
	});

	fabricCanvas.observe("mouse:down", function(e) {
		console.log("down", e.e.x, e.e.y);
	});
});