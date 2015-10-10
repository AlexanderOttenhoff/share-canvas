Meteor.publish('canvasStates', function() {
	return CanvasStates.find();
});
