Meteor.publish('games', function() {

    var isDrawer = this.userId === Games.current().drawerId,
      fields = isDrawer ? {} : {solution: 0};

    return Games.find({}, {
        fields: fields
    });
});