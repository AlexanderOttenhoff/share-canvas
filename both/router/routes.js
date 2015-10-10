Router.route('/', function() {
	Meteor.subscribe("canvasStates");
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
