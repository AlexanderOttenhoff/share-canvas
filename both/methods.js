Meteor.methods({
    ping() {
        return Meteor.users.update(this.userId, {
            $set: {'profile.activeAt': new Date()}
        });
    }
});
