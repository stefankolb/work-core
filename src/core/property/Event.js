/**
 * Contains all relevant data fields for property change events.
 */
core.Class("core.property.Event", 
{
  pooling: true,

  /**
   * Creates a new event object with the given @type {String}. It stores the current @value {var}, 
   * the @old {var?} value and the @name {String?} of the property which was modified.
   */
  construct : function(type, value, old, name) 
  {
    var self = this;

    self.type = type;
    self.value = value;
    self.old = old;
    self.name = name;
  },

  members : 
  {
    /** {=var} Type of event */
    type : null,

    /** {=var} Current property value */
    value : null,

    /** {=var} Previous property value */
    old : null,

    /** {=var} Property name */
    name : null,

    /**
     * {var} Returns event type
     */
    getType : function() {
      return this.type;
    },

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
