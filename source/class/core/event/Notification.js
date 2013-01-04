/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

core.Class("core.event.Notification",
{
  pooling : true,

  /**
   * @data {Object} Data to be attached to the event
   * @message {String} Message for user feedback etc.
   */
  construct : function(data, message) 
  {
    this.data = data;
    this.message = message;
  },

  members :
  {

    getData : function() {
      return this.data;
    },

    getMessage : function() {
      return this.message;
    }

  }
});
