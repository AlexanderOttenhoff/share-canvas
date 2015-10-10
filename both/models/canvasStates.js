CanvasStates = new Mongo.Collection('canvasStates');

if (Meteor.isServer) {
	CanvasStates.allow({
		insert: function() {
			return true;
		},
		update: function() {
			return true;
		},
		remove: function() {
			return true;
		}
	});
}

// Unofficial Schema:
var sampleSchema = {
	startTime: "Timestamp",
	objects: [
		// Array of objects taken directly from fabric canvas
	],
	roomId: "ID" // Not used at the moment, but possibly useful in the future
}