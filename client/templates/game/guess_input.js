Template.guess_input.events({
  "keypress #guess_input_field"(event){

    if (event.which === 13) {   // enter key
      submitGuess()
    }
  },
  "click #btn-chat": submitGuess,
});


function submitGuess(){
  var $inputField = $('#guess_input_field');
  var text = $inputField.val();

  Games.current().makeGuess(text, function(err, result){
    if (result){
      // clear the field
      $inputField.val("");
    }
  });
}