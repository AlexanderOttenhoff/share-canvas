Games = new Mongo.Collection('games', {
	transform(doc) {
		return new Game(doc);
	}
});

class Game extends Record {
	// Define Game specfic methods here.

	makeGuess(guess, callback) {
		Meteor.call('makeGuess', this._id, guess, callback);
	}
};

Meteor.methods({
	makeGuess(gameId, guess) {
		// Assert that the gueses array exists:
		Games.update({
			_id: gameId,
			guesses: {$exists: false}
		}, {
			$set: {guesses: []}
		});

		// Add the guess to the array
		Games.update(this._id, {
			$addToSet: {
				guesses: {
					guessedAt: new Date(),
					userId: this.userId,
					text: guess
				}
			}
		});
	}
});


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