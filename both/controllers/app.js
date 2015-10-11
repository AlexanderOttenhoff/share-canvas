AppController = RouteController.extend({
  //layoutTemplate: 'appLayout'

  waitOn() {
    return [
      Meteor.subscribe('currentGame'),
      Meteor.subscribe('currentGameSolution')
    ];
  }
});

AppController.events({
  'click [data-action=logout]' : function() {
    AccountsTemplates.logout();
  }
});
