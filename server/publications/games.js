Meteor.publish('games', function() {


    var isDrawer = Games.current() && (this.userId === Games.current().drawerId),
      fields = isDrawer ? {} : {solution: 0};

    return Games.find({}, {
        fields: fields
    });
});