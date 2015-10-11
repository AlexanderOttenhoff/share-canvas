Template.registerHelper('isDrawer', function() {
  var currentGame = Games.current();
  return currentGame && currentGame.isDrawer();
});
