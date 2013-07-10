core.Class("core.mvc.presenter.NavigationPresenter",
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

    setParam : function(param) {
      this.__param = param;
    },

    getParam : function() {
      return this.__param;
    },

    setSegment : function(segment) {
      this.__segment = segment;
    },

    getSegment : function() {
      return this.__segment;
    },

    



  }
});
