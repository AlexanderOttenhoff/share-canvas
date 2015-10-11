Router.route('/', function() {
	// TODO: Enable after removing autoPublish
	// Meteor.subscribe("canvasStates", /*Room ID*/);
	this.render("game");
}, {
  name: 'home',
});

Router.plugin('ensureSignedIn');
