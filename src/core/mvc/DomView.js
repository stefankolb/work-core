core.Class("core.mvc.DomView",
{
  include : [core.mvc.View],

  construct: function(properties) 
  {
    core.mvc.View.call(this, properties);


  },


  properties : 
  {
    /** The root element to render into */
    root : 
    {
      check: "Element",
      nullable : true
    }

    



  }


});
