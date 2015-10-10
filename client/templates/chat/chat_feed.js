Template.chat_feed.onCreated(function() {
  this.subscribe('messages', { roomId: 1 });
});

Template.chat_feed.onRendered(function() {
  this.autorun(function(){
    Messages.find({}, { sort: {createdAt: 1}}).observe({
      added: function () {
        // scroll to the bottom of chat div (hacky!)
        $('.panel-body.msg_container_base').scrollTop(100000);
      }
    });
  });
});


Template.chat_feed.helpers({
  messages(){
    return Messages.find({}, { sort: {createdAt: 1}});
  },
  isOwnMessage(){
    return this.authorId === Meteor.userId();
  }
});

var roomId = 1;

Template.chat_feed.events({
  "keypress #chat_input_field"(event){

    if (event.which === 13) {   // enter key
      submitMessage()
    }
  },
  "click #btn-chat": submitMessage,
});


function submitMessage(){
  var $inputField = $('#chat_input_field');
  var text = $inputField.val();

  // save to db
  Messages.insert({
    authorId: Meteor.userId(),
    content: text,
    roomId: roomId,
    createdAt: new Date()
  });

  // clear the field
  $inputField.val("");
}