Template.game.helpers({
  currentGame(){
    return Games.current();
  },
  timer(){
    Session.get('tick');

    if (Games.current()){
      var startTime = Games.current().startTime;
      var start = moment(startTime);
      var now = moment();

      return now.diff(start, 'seconds');
    }
  },
});

Template.game.onRendered(function(){
  Session.set('tick', 0);
  Meteor.setInterval(function(){
    var tick = Session.get('tick');
    Session.set('tick', tick + 1);

  }, 1000)
});