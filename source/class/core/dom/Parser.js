core.Module("core.dom.Parser",
{
  parseHtml : function(content)
  {
    var doc = document.implementation.createHTMLDocument("");
    if (content.toLowerCase().indexOf('<!doctype') > -1) {
      doc.documentElement.innerHTML = content;
    } else {
      doc.body.innerHTML = content;
    }

    return doc;
  }
});
