core.Class("core.mvc.presenter.Main",
{
  include : [core.mvc.presenter.Abstract],

  construct : function(parent)
  {
    core.mvc.presenter.Abstract.call(this, parent);

    // Debug
    this.log("Version: " + jasy.Env.getValue("jasy.build.rev"));
    this.log("Date: " + new Date(jasy.Env.getValue("jasy.build.time")));

    // Prepare history object   
    this.__history = unify.bom.History.getInstance();
    this.__history.addListener("change", this.__onHistoryChange, this);

  },


  properties :
  {
    active :
    {
      nullable : true,
      apply : function(value, old)
      {
        if (old) {
          old.disable(this.__navigationDirection);
        }

        if (value) {
          value.enable(this.__navigationDirection);
        }
      }
    }
  },

  members : 
  {
    /** {=String} Either "in", "out", "other" */
    __navigationDirection : null,

    /** {=core.util.HashPath} Current path object */
    __navigationPath : null,


    /**
     * Reacts on all native history changes
     */
    __onHistoryChange : function(e)
    {
      var path = core.util.HashPath.obtain(e.getData());
      if (path.length == 0) 
      {
        this.__history.setLocation("home");
        return;       
      }

      var current = path.getCurrent();
      if (!current) {
        return;
      }

      var presenter = this.getChild(current.presenter);
      if (!presenter) 
      {
        this.warn("Unknown presenter: " + current.presenter);
        return;
      }

      // Switch to new path while remember the old one
      var oldPath = this.__navigationPath;
      this.__navigationPath = path;

      // Detect movement between the two paths
      this.__navigationDirection = oldPath ? oldPath.compareTo(path) : "jump";

      // Make old path available for reusage
      if (oldPath) {
        oldPath.release();  
      }

      // Configure next presenter
      presenter.setParam(current.param);
      presenter.setSegment(current.param);

      // Switch to that presenter
      this.setActive(presenter);
    },


    /**
     * Navigate to given @fragment {String} with optional hint regarding the @relation {String}.
     */
    navigate : function(fragment, relation)
    {
      // View specific features and/or global navigation processing
      if (relation == "menu")
      {
        var view = this.getView("root");
        view.setMenuOpen(!view.getMenuOpen());
      }
      else
      {
        // Use current path to create a new mutated one
        var path = this.__navigationPath.navigate(fragment, relation);

        // Apply that path to the browser's native location hash
        location.hash = "#" + path.serialize();

        // Make path instance available to next user
        path.release();
      }
    },


    /**
     * Real initialization code after first rendering
     */
    init : function() 
    {
      this.__history.init();

      if (location.hash == "") {
        location.hash = "#home";
      }
    }


  }
});
