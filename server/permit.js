Games.allow({
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