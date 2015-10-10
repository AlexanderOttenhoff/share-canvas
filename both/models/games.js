Games = new Mongo.Collection('games', {
	transform(doc) {
		return new Game(doc);
	}
});

class Game extends Record {
	// Define Game specfic methods here.

	isDrawer() {
		return this.drawerId === Meteor.userId();
	}

	makeGuess(guess, callback) {
		return Meteor.call('makeGuess', this._id, guess, callback);
	}
};

Meteor.methods({

	makeGuess(gameId, answer) {
		// Assert that the gueses array exists:
		Games.update({
			_id: gameId,
			guesses: {$exists: false}
		}, {
			$set: {guesses: []}
		});

		var guessObject =  {
			guessedAt: new Date(),
			userId: this.userId,
			answer: answer
		};

		if (Meteor.isServer) {
			var game = Games.findOne(gameId, {
				fields: {answer: 1}
			});
			guessObject.isCorrect = (game.answer === answer);
		}

		// Add the guess to the array
		return Games.update(gameId, {
			$push: {guesses: guessObject}
		});
	}
});

// Unofficial Schema:
var sampleSchema = {
	answer: "Pirates of the Caribbean",
	gsuess: [{
		text: "The Matrix",
		userId: 'userId',
		guessedAt: new Date(),
		isCorrect: false
	}],
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