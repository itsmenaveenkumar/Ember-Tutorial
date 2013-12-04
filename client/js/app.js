App = Ember.Application.create();

App.Router.map(function() {
    this.resource("example",{ path: 'example/:id' });
    this.resource("exampleIframe",{ path: 'exampleIframe/:id' });
    this.route("home");
});

App.IndexRoute = Ember.Route.extend({
    redirect : function () {
        this.transitionTo('home');
    }
});

var url = '/tutorial/examples/example1/example1.hbars';

App.ExampleRoute = Ember.Route.extend({
    beforeModel: function(transtion){

    },
    model: function(params){
      return params.id;
    },
    setupController: function(controller, model) {
      controller.set('example', 'example'+model);
      controller.set('link',"/tutorial/examples/example"+model+"/controller.js");
      App.set('exampleSrc', '/#/exampleIframe/'+model);
      App.set('exampleWorkSpace','/editor/?path=F:\\Tutorials\\github\\0.1\\client\\examples\\example'+model);
      App.set('exampleHbar', '/tutorial/examples/example'+model+'/hbar.hbars');
      App.set('exampleJs', '/tutorial/examples/example'+model+'/controller.js');
    }
}); 
App.ExampleController = Ember.Controller.extend({

});
App.ExampleView = Ember.View.extend({
    didInsertElement: function(){
      //this.get('controller').transitionToRoute(this.get('controller').get('example'));
    }
});

App.ExampleHtmlView = Ember.View.extend({
  tagName: 'iframe',
  classNameBindings: [':exampleViewer',':frame'],
  attributeBindings: ['src'],
  src: function(){
    return App.get('exampleSrc');
  }.property()
});

App.ExampleIDEView = Ember.View.extend({
  tagName: 'iframe',
  classNameBindings: [':exampleViewer',':frame'],  
  attributeBindings: ['src'],
  src: function(){
    return App.get('exampleWorkSpace');
  }.property()
});

App.ExampleIframeRoute = Ember.Route.extend({
    beforeModel: function(transtion){

    },
    model: function(params){
      return params.id;
    },
    setupController: function(controller, model) {

      Ember.$.ajax({
        url: '/tutorial/examples/example'+model+'/hbar.hbars',         
        async: false,
        success: function (resp) {
          Ember.TEMPLATES['example'+model] = Ember.Handlebars.compile(resp);
          App.Router.map(function() {
              var router = this;
              router.route('example'+model); 
          });          
        }         
      });
      controller.set('example', 'example'+model);
    }
}); 
App.ExampleIframeController = Ember.Controller.extend({

});
App.ExampleIframeView = Ember.View.extend({
    didInsertElement: function(){
      this.get('controller').transitionToRoute(this.get('controller').get('example'));
    }
});