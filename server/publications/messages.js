Meteor.publish('messages', function(options){
  return Messages.find(
    { roomId: options.roomId },
    {
      sort: { createdAt: -1 },
      limit: 10
    });
});