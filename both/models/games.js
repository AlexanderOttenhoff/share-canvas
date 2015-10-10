Games = new Mongo.Collection('games', {
	transform(doc) {
		return new Game(doc);
	},
	_preventAutopublish: true
});

class Game extends Record {
	// Define Game specfic methods here.

	isDrawer() {
		return this.drawerId === Meteor.userId();
	}

	makeGuess(guess, callback) {
		return Meteor.call('makeGuess', this._id, guess, callback);
	}

}

Meteor.methods({

	makeGuess(gameId, answer) {
		// Assert that the gueses array exists:
		Games.update({
			_id: gameId,
			guesses: {$exists: false}
		}, {
			$set: {guesses: []}
		});

		var guess =  {
			guessedAt: new Date(),
			userId: this.userId,
			answer: answer
		};

		if (Meteor.isServer) {
			var game = Games.findOne(gameId, {
				fields: {answer: 1}
			});
			guess.isCorrect = (game.solution === answer);
		}

		// Add the guess to the array
		return Games.update(gameId, {
			$push: {guesses: guess}
		});
	}
});

// Unofficial Schema:
var sampleSchema = {
	guess: [{
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
	return Games.findOne({endTime: {$exists: false}}, _.defaults({
		sort: {startTime: -1}
	}, options));
};

Games.startNewRound = (drawerId) => {
	Games.update({endTime: {$exists: false}}, {
		$set: {endTime: new Date()}
	}, {multi: true});

	var pool = ThingsToGuess.findOne();

	Games.insert({
		startTime: new Date(),
		drawerId: drawerId,
		solution: Random.choice(pool.movies)
	});
};

Meteor.startup(() => {
	if (Games.find().count() == 0) {
		Games.insert({startTime: new Date()});
	}
});
