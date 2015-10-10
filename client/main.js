// TODO: Remove for release
// var fabricCanvas;
var gameId;

function resizeCanvas() {
	console.log("New Window:", window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas, false);


Template.drawCanvas.onRendered(function() {
	fabricCanvas = new fabric.Canvas('draw-canvas');

	var latestGame = Games.findOne({}, {
		sort: {
			startTime: -1
		}
	});

	if (!_.isUndefined(latestGame)) {
		fabricCanvas.loadFromJSON(latestGame.state);
		gameId = latestGame._id;
	}
	fabricCanvas.isDrawingMode = true;


	if (_.isUndefined(latestGame)) {
		Games.insert({startTime: new Date()}, function(err, res) {
			if (err) console.error(err);
			else console.log(res);
			gameId = res;
		});
	}

	fabricCanvas.on("mouse:move", function(e) {
		if (e.e.buttons & 1) {
			var state = fabricCanvas.toJSON();

			// Here's where we update the collection
			Games.update({
				_id: gameId
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
