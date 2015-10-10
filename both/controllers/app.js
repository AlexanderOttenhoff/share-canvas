AppController = RouteController.extend({
  //layoutTemplate: 'appLayout'

  waitOn() {
    return Meteor.subscribe('games');
  }
});

AppController.events({
  'click [data-action=logout]' : function() {
    AccountsTemplates.logout();
  }
});
