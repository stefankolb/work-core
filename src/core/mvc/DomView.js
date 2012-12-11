core.Class("core.mvc.DomView",
{
  include : [core.mvc.View],

  construct: function(properties, events) 
  {
    core.mvc.View.call(this, properties);

    for (var key in events) {


    }
  },


  properties : 
  {
    /** The root element to render into */
    root : 
    {
      check: "Element",
      nullable : true,
      apply : function(value, old) {

      }
    }

  },


  members : 
  {
    render : function() 
    {
      var data = this.getModel();

      var elem = this.getRoot();
      if (!elem)
      {
        var id = this.getId();
        elem = document.getElementById(id);
        this.setRoot(elem);
      }

      elem.innerHTML = this.getTemplate().render(data ? data.toJSON() : {});

      return this;
    }    
  }


});
