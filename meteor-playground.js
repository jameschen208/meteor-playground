Todolist = new Mongo.Collection('todo')

if (Meteor.isClient) {
  Template.body.helpers({
    todo: function() {
      return Todolist.find();
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
