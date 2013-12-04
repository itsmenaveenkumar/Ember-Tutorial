App.Example2Route = Ember.Route.Extend({
	setupController : function(controller, model){
		controller.set('content', 'Hello World');
	}	
});
App.Example2Controller = Ember.Controller.Extend({

});