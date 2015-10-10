// TODO: Remove for release
// var fabricCanvas;
var currentId;

function resizeCanvas() {
	console.log("New Window:", window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas, false);


Template.drawCanvas.onRendered(function() {
	fabricCanvas = new fabric.Canvas('draw-canvas');

	var latestCanvasState = CanvasStates.findOne({}, {
		sort: {
			startTime: -1
		}
	});

	fabricCanvas.loadFromJSON(latestCanvasState.state);
	fabricCanvas.isDrawingMode = true;

	currentId = latestCanvasState._id;

	if (_.isUndefined(latestCanvasState)) {
		CanvasStates.insert({startTime: new Date()}, function(err, res) {
			if (err) console.error(err);
			else console.log(res);
			currentId = res;
		});
	}

	fabricCanvas.observe("mouse:move", function(e) {
		if (e.e.buttons & 1) {
			var state = fabricCanvas.toJSON();

			// Here's where we update the collection
			CanvasStates.update({
				_id: currentId
			}, {
				$set: {
					state: state
				}
			}, function(err, res) {
				if (err) console.error(err);
				else console.log(res);
			});
		}
	});
});
