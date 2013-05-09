/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

core.Module("core.event.Flow",
{
  /**
   * Initiates a competitive race that allows one winner, returning a promise that will 
   * resolve when any one of the items in array resolves. The returned promise will 
   * only reject if all items in array are rejected. The resolution value of the returned 
   * promise will be the fulfillment value of the winning promise. The rejection value will be 
   * an array of all rejection reasons.
   */
  any : function(promisesOrValues)
  {

  },

  /**
   * Return a promise that will resolve only once all the inputs have resolved. 
   * The resolution value of the returned promise will be an array containing the 
   * resolution values of each of the inputs.
   *
   * If any of the input promises is rejected, the returned promise will be 
   * rejected with the reason from the first one that is rejected.
   *
   * Inspired by when.js
   */
  all : function(promisesOrValues)
  {

  },


  



});
