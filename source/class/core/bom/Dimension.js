core.Module("core.bom.Dimension",
{
  getInnerWidth : function(element) {
    return element.clientWidth - core.bom.Style.getInteger(element, "paddingLeft", true) - core.bom.Style.getInteger(element, "paddingRight", true);
  },

  getInnerHeight : function(element) {
    return element.clientHeight - core.bom.Style.getInteger(element, "paddingTop", true) - core.bom.Style.getInteger(element, "paddingBottom", true);
  }
});
