Meteor.publish('games', () => {
    return Games.find({}, {
        fields: {
            solution: 0
        }
    });
});