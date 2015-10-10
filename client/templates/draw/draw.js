// TODO: Remove for release
// var fabricCanvas;
var gameId;

function resizeCanvas() {
	console.log("New Window:", window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas, false);


Template.drawCanvas.onRendered(function() {
	var template = this;
	var fabricCanvas = null;

	this.autorun(()=> {
		var currentGame = Games.current({
			fields: {
				_id: 1,
				drawer: 1
			}
		});

		var gameId = currentGame._id;

		if (!currentGame) {
			return;
		}

		if (!fabricCanvas)
			fabricCanvas = new fabric.Canvas(template.find('#draw-canvas'));

		var isDrawer = true; //currentGame.isDrawer();

		Tracker.autorun(() => {
			var currentGame = Games.findOne(gameId, {
				reactive: !isDrawer,
				fields: {state: 1}
			});

			fabricCanvas.loadFromJSON(currentGame.state);
		});

		fabricCanvas.isDrawingMode = isDrawer; //currentGame.isDrawer();

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
});
