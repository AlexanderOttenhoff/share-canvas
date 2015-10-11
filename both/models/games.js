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

	winningGuess() {
		return _.findWhere(this.guesses, {
			isCorrect: true
		});
	}

	drawer(options) {
		Meteor.users.findOne(this.drawerId, options);
	}
}

function compareGuess(attempt, answer) {
	return attempt.toLowerCase() === answer.toLowerCase();
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
				fields: { solution: 1}
			});
			guess.isCorrect = compareGuess(answer, game.solution);
		}

		// Add the guess to the array
		Games.update(gameId, {
			$push: {guesses: guess}
		});


		// TODO display message to all users

		// start new round
		Meteor.setTimeout(function(){
			Games.startNewRound();
		}, 5000);

		if (guess.isCorrect){
			return "win";
		}
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

Games.currentGameCursor = (query, options) => {
	var actualQuery = {
		endTime: {$exists: false}
	};

	if (query && _.size(query)) {
		actualQuery.$and = [query];
	}

	return Games.find(actualQuery, _.defaults({
		sort: {startTime: -1},
		limit: 1
	}, options));
};

Games.current = (options) => {
	return Games.currentGameCursor({}, options).fetch()[0];
};

Games.getDrawer = (options) => {
	var lastGame = Games.findOne({endTime: {$exists: true}}, {endTime: -1});
	var winningGuess = lastGame && lastGame.winningGuess();
	var winnerId = winningGuess && winningGuess.userId;
	var query = {
		'profile.activeAt': {$gte: new Date(Date.now() - 10000)}
	};
	return winnerId && Meteor.users.findOne(_.defaults({
		_id: winnerId
	}, query), options) || Meteor.users.findOne(query, options);
};

Games.roundTimeout = 120000;

Games.startNewRound = () => {
	var drawer = Games.getDrawer();

	if (drawer) {
		Games.update(
			{
				endTime: {$exists: false} },
			{
				$set:
					{ endTime: new Date() }
			},
			{
				multi: true
			}
		);

		var pool = ThingsToGuess.findOne();

		var gameId = Games.insert({
			startTime: new Date(),
			drawerId: drawer._id,
			solution: Random.choice(pool.movies)
		});

		Meteor.setTimeout(() => {
			Games.update({
				_id: gameId,
				endTime: {$exists: false}
			}, {$set: {
				endTime: new Date
			}});
		}, Games.roundTimeout);

		return gameId;
	}
};


// Start new rounds automatically when a drawer is available.
Meteor.isServer && Meteor.setInterval(() => {
	var currentGame = Games.current();

	Games.update({
		startTime: {$lt:  new Date(Date.now() - Games.roundTimeout)},
		endTime: {$exists: false}
	}, {
		$set: {
			endTime: new Date()
		}
	});

	if (currentGame) {
		// Check if the drawer of the game is still active

		var drawer = currentGame.drawer();

		if (drawer && drawer.activeAt < Date.now() - 10000) {
			Games.startNewRound();
		}
	}
	else {
		Games.startNewRound();
	}
}, 10000);

if (Meteor.isServer) {
	Meteor.startup(() => {
		if (Games.find().count() == 0) {
			Games.startNewRound();
		}
	});
}
