Todolist = new Mongo.Collection('todo')

if (Meteor.isClient) {
  Template.body.helpers({
    todo: function() {
      return Todolist.find();
    }
  });

  Template.body.events({
    'submit .new-todo': function(event) {
      //when the submit is triggered, do things in the bracket
      var t = event.target.title.value;
      //grabbing the title and setting it to variable t
      Todolist.insert({
      //insert in the following into the Todolist model or collection
        title: t,
      //inserting the var t into the title column  
        createdAt: new Date()  
      });

      event.target.title.value = "";
      //eliminating the previous value
      return false;
      //makes sure the page doesn't refresh
    }
  });

  Template.todos.events({
    'click .toggle-checked': function(){
      Todolist.update(this._id, {$set: {checked:!this.checked}});
      //what's the value of this, it flips the current value to the opposite boolean
    },
    'click .delete': function() {
      Todolist.remove(this._id);
      // remove takes the ID of an obj. mongodb assigns id's to ojbects with _id.
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
