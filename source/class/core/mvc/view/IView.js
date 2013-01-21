core.Interface("core.mvc.view.IView",
{
  /**
   * @presenter {core.mvc.presenter.Abstract} Presenter instance to connect to
   */
  // Not supported yet  
  // construct: function(presenter) {},
  
  events :
  {
    /** Fired after the view has been shown */
    "show" : core.event.Simple,

    /** Fired after the view has been hidden */
    "hide" : core.event.Simple
  },

  members :
  {
    /**
     * {core.mvc.presenter.Abstract} Returns the attached presenter instance
     */
    getPresenter : function() {},

    /**
     * Renders the view using data from the attached presenter.
     */
    render : function() {},

    /**
     * Hides the view.
     */
    hide : function() {},

    /**
     * Shows the view.
     */
    show : function() {}
  }
});
