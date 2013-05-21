/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

/**
 * API to query element dimensions
 */
core.Module("core.bom.Dimension",
{
  /**
   * {Integer} Returns the inner width of @element {Element}.
   */
  getInnerWidth : function(element) {
    return element.clientWidth - core.bom.Style.getInteger(element, "paddingLeft", true) - core.bom.Style.getInteger(element, "paddingRight", true);
  },
  

  /**
   * {Integer} Returns the inner height of @element {Element}.
   */
  getInnerHeight : function(element) {
    return element.clientHeight - core.bom.Style.getInteger(element, "paddingTop", true) - core.bom.Style.getInteger(element, "paddingBottom", true);
  }
});
