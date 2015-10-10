Games = new Mongo.Collection('games');

if (Meteor.isServer) {
	Games.allow({
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
	endTime: "Timestamp", //Only filled out when a game has finished
	state: [
		// All of the objects stored on the canvas
	],
	roomId: "ID" // Not used at the moment, but possibly useful in the future
}