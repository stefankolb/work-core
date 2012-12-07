/**
 * Contains all relevant data fields for property change events.
 */
core.Class("core.property.Event", 
{
  /**
   * Creates a new event object with the current @value {var}, 
   * the @old {var?} value and the @name {String?} of the property.
   */
  construct : function(value, old, name) 
  {
    var self = this;

    if (old == null) {
      old = null;
    }

    if (name == null) {
      name = null;
    }

    self.value = value;
    self.old = old;
    self.name = name;
  },

  members : 
  {
    /** {=var} Current property value */
    value : null,

    /** {=var} Previous property value */
    old : null,

    /** {=var} Property name */
    name : null,

    /**
     * {var} Returns the current property value
     */
    getValue : function() {
      return this.value;
    },

    /**
     * {var} Returns the previous property value
     */
    getOldValue : function() {
      return this.old;
    },

    /**
     * {String} Returns the name of the property
     */
    getName : function() {
      return this.name;
    }
  }
});
