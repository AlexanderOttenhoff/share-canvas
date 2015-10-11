function resizeCanvas() {
	console.log("New Window:", window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas, false);


Template.drawCanvas.onRendered(function() {
	var template = this;
	var fabricCanvas = null;

	this.autorun(()=> {
		// This autorun will rerun whenever there is a new game made available
		// or when the current user changes from being a drawer to not being a
		// drawer or vice-versa.

		var currentGame = Games.current({
			fields: {
				_id: 1,
				drawerId: 1
			}
		});

		if (!currentGame) {
			//There is nure current game, so wait for the next computation.
			return;
		}

		var gameId = currentGame._id;

		if (!fabricCanvas) {
			//This is the first time we are having a game, so initialize the
			//the canvas
			fabricCanvas = new fabric.Canvas(template.find('#draw-canvas'));
		}
		else {
			fabricCanvas.clear();
		}

		var isDrawer = currentGame.isDrawer();


		//Isolate the canvas state autorun form the parent autorun
		Tracker.autorun(() => {
			//Get the game again, but this time with the canvas state included.
			var currentGame = Games.findOne(gameId, {
				// Do not react to changes when the current user is the drawer.
				reactive: !isDrawer,
				fields: {state: 1}
			});

			fabricCanvas.loadFromJSON(currentGame.state);
			
			// Disable ability to select and move paths
			_.each(fabricCanvas.getObjects(), function(path){
				path.selectable = false;
			});
			
			// Draw Null object to refresh canvas after loading JSON
			fabricCanvas.add(new fabric.Path('M 0 0 L 0 0'));
		});

		fabricCanvas.isDrawingMode = isDrawer;
		fabricCanvas.freeDrawingBrush.width=5;

		if (isDrawer) {
			fabricCanvas.on("object:added", function (e) {
				var state = fabricCanvas.toJSON();

				// Here's where we update the collection
				Games.update({
					_id: gameId
				}, {
					$set: {
						state: state
					}
				}, function (err, res) {
					if (err) console.error(err);
					// else console.log(res);
				});
			});
		}
	});
});
