// TODO: Remove for release
// var fabricCanvas;

function resizeCanvas() {
	console.log("New Window:", window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas, false);


Template.drawCanvas.onRendered(function() {
	fabricCanvas = new fabric.Canvas('draw-canvas', {
		isDrawingMode: true
	});

	var currentCanvasState = CanvasStates.findOne({}, {
		sort: {
			startTime: -1
		}
	});

	if (_.isUndefined(currentCanvasState)) {
		CanvasStates.insert({startTime: new Date()}, function(err, res) {
			if (err) console.error(err);
			else console.log(res);
		});
	}

	fabricCanvas.observe("mouse:move", function(e) {
		if (e.e.buttons & 1) {
			var objects = fabricCanvas.toJSON().objects;

			// Here's where we update the collection
			CanvasStates.update({
				_id: currentCanvasState._id
			}, {
				$set: {
					objects: objects
				}
			}, function(err, res) {
				if (err) console.error(err);
				else console.log(res);
			});
		}
	});
});
