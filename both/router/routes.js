Router.route('/', function() {
	// TODO: Enable after removing autoPublish
	// Meteor.subscribe("canvasStates", /*Room ID*/);
	this.render("home");
}, {
  name: 'home',
});

Router.route('/dashboard', {
  name: 'dashboard',
  controller: 'DashboardController'
});

Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});
