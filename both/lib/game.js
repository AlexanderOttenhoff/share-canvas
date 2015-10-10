/* global game: true, currentGame = true */

Game = function () {

};

Game.prototype = {
    constructor: Game,

    isDrawer: () => {
        var user = Meteor.user();
        return user && user.profile && user.profile.drawer;
    }
};

currentGame = new Game()