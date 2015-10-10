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

Meteor.users.allow({
    insert: function() {
        return false;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return false;
    }
});