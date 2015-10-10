Meteor.setInterval(function() {
	if (!_.isNull(Meteor.userId())) {
		Meteor.users.update(Meteor.userId(), {
			$set: {
				activeAt: new Date()
			}
		});
	}
}, 5000);
