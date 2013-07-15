core.Class("core.mvc.presenter.Navigation",
{
  include : [core.mvc.presenter.Abstract],

  construct : function()
  {
    core.mvc.presenter.Abstract.call(this);


  },

  members :
  {
    __param : null,
    __segment : null,

    setParam : function(param) 
    {
      this.__param = param;

      this.forEachView(function(view) {
        view.render();
      })
    },

    getParam : function() {
      return this.__param;
    },

    setSegment : function(segment) 
    {
      this.__segment = segment;

      this.forEachView(function(view) {
        view.render();
      })
    },

    getSegment : function() {
      return this.__segment;
    },

    enable : function(approach)
    {
      var names = this.getAllViewNames();
      for (var i=0, l=names.length; i<l; i++)
      {
        var view = this.getView(names[i]);
        view.show(approach);
      }
    },

    disable : function(approach)
    {
      var names = this.getAllViewNames();
      for (var i=0, l=names.length; i<l; i++)
      {
        var view = this.getView(names[i]);
        view.hide(approach);
      }
    }
  }
});
