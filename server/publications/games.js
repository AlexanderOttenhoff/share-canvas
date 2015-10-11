Meteor.publish('currentGame', () => {
    return Games.currentGameCursor({},{fields: {solution: 0}});
});

Meteor.publish('currentGameSolution', function () {
    return Games.currentGameCursor({
        drawerId: this.userId
    }, {fields: {solution: 1}});
});