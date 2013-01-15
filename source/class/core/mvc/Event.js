core.Class("core.mvc.Event",
{
  pooling : true,
  include : [core.event.MDispatchable],

  construct : function(model) {
    this.__model = model;
  },

  members :
  {
    getModel : function() {
      return this.__model;
    }
  }
});
