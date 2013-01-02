/**
 * Event class which is fired whenever a model is added to a collection.
 */
core.Class("core.mvc.event.AddModel", 
{
  pooling: true,
  include : ["core.event.MEvent"],

  construct: function(model) {
    this.model = model;
  },

  members: 
  {
    type : "add",

    getType : function() {
      return this.type;
    },
    
    getModel : function() {
      return this.model;
    }
  }
});
