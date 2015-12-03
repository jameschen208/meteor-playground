Todolist = new Mongo.Collection('todo')

if (Meteor.isClient) {
  Meteor.subscribe("todo");
// ************* HELPERS
  Template.body.helpers({
    todo: function() {
      if(Session.get('hideFinished')) {
        return Todolist.find({checked: {$ne: true}});
        //as long as checked is Not Equal to true, return the to do
      } else {
        return Todolist.find();
      }
    },
    hideFinished: function() {
      return Session.get('hideFinished');
    }
  });
  Template.todos.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  });

// ************* EVENTS
  Template.body.events({
    'submit .new-todo': function(event) {
      //when the submit is triggered, do things in the bracket
      var t = event.target.title.value;
      //grabbing the title and setting it to variable t
      Meteor.call("addTodo", t);

      event.target.title.value = "";
      //eliminating the previous value
      return false;
      //makes sure the page doesn't refresh
    },
    'change .hide-finished': function(event) {
      Session.set('hideFinished', event.target.checked);
      //creating the session variable if it doesn't exist and sets it to whatever the current state is

    }
  });

  Template.todos.events({
    'click .toggle-checked': function(){
      Meteor.call("updateTodo", this._id, !this.checked);
    },
    'click .delete': function() {
      Meteor.call("deleteTodo", this._id);
    },
    'click .toggle-private': function(){
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

// ************* SERVER
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("todo", function(){
    return Todolist.find();
  });
}
// ************* METHODS
Meteor.methods({
  addTodo: function(t) {
    Todolist.insert({
      //insert in the following into the Todolist model or collection
        title: t,
      //inserting the var t into the title column  
        createdAt: new Date(),  
        owner: Meteor.userId()
    });
  },
  updateTodo: function(id, checked) {
    Todolist.update(id, {$set: {checked:checked}});
    //what's the value of this, it flips the current value to the opposite boolean
  },
  deleteTodo: function(id) {
    Todolist.remove(id);
  },
  setPrivate: function(id, private) {
    var d = Todolist.findOne(id);

    if(d.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Todolist.update(id, {$set: {private: private}});
  }
});
