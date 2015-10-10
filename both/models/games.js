Games = new Mongo.Collection('games', {
	transform(doc) {
		return new Game(doc);
	}
});

class Game extends Record {
	// Define Game specfic methods here.
};


// Unofficial Schema:
var sampleSchema = {
	startTime: "Timestamp",
	endTime: "Timestamp", //Only filled out when a game has finished
	state: [
		// All of the objects stored on the canvas
	],
	roomId: "ID", // Not used at the moment, but possibly useful in the future
	drawer: "userID", // ID of player with draw priviledges
	solution: "Bridge over the River Kwai" // Solution string of the game
};

Games.current = (options = {}) => {
	Games.findOne({endTime: {$exists: false}}, _.extend({
		sort: {startTime: -1}
	}, options));
};