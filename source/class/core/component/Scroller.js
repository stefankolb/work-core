(function(undef) 
{
  var transformOriginProperty = core.bom.Style.property("transformOrigin");
  var perspectiveProperty = core.bom.Style.property("perspective");
  var transformProperty = core.bom.Style.property("transform");

  if (perspectiveProperty) 
  {
    var render = function(left, top, zoom) 
    {
      var content = this.__container.firstElementChild;
      content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
    };   
  } 
  else if (transformProperty) 
  {  
    var render = function(left, top, zoom) 
    {
      var content = this.__container.firstElementChild;
      content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
    }; 
  } 
  else 
  {  
    var render = function(left, top, zoom) 
    {
      var content = this.__container.firstElementChild;
      content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
      content.style.marginTop = top ? (-top/zoom) + 'px' : '';
      content.style.zoom = zoom || '';
    };
  }  

  core.Class("core.component.Scroller",
  {
    construct : function(container, options) 
    {  
      this.__container = container;
      this.__options = options || {};

      // create Scroller instance
      var that = this;
      this.__scroller = new core.ui.Scroller(function(left, top, zoom) {
        that.render(left, top, zoom);
      }, options);

      // bind events
      this.__bindEvents();
    },

    members :
    {
      init : function() 
      {
        var content = this.__container.firstElementChild;
        content.style[transformOriginProperty] = "left top";

        this.reflow();
      },


      /**
       *
       */
      render : render,


      /**
       *
       */
      reflow : function() 
      {
        var container = this.__container;
        var content = container.firstElementChild;

        // set the right scroller dimensions
        this.__scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);

        // refresh the position for zooming purposes
        var rect = container.getBoundingClientRect();
        this.__scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
        
      },


      /**
       *
       */
      __bindEvents : function() 
      {
        var that = this;

        // reflow handling
        window.addEventListener("resize", function() {
          that.reflow();
        }, false);

        // touch devices bind touch events
        if ('ontouchstart' in window) {

          this.__container.addEventListener("touchstart", function(e) {

            // Don't react if initial down happens on a form element
            if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
              return;
            }

            that.__scroller.doTouchStart(e.touches, e.timeStamp);
            e.preventDefault();

          }, false);

          document.addEventListener("touchmove", function(e) {
            that.__scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
          }, false);

          document.addEventListener("touchend", function(e) {
            that.__scroller.doTouchEnd(e.timeStamp);
          }, false);

          document.addEventListener("touchcancel", function(e) {
            that.__scroller.doTouchEnd(e.timeStamp);
          }, false);

        // non-touch bind mouse events
        } else {
          
          var mousedown = false;

          this.__container.addEventListener("mousedown", function(e) {

            if (e.target.tagName.match(/input|textarea|select/i)) {
              return;
            }
          
            that.__scroller.doTouchStart([{
              pageX: e.pageX,
              pageY: e.pageY
            }], e.timeStamp);

            mousedown = true;
            e.preventDefault();

          }, false);

          document.addEventListener("mousemove", function(e) {

            if (!mousedown) {
              return;
            }
            
            that.__scroller.doTouchMove([{
              pageX: e.pageX,
              pageY: e.pageY
            }], e.timeStamp);

            mousedown = true;

          }, false);

          document.addEventListener("mouseup", function(e) {

            if (!mousedown) {
              return;
            }
            
            that.__scroller.doTouchEnd(e.timeStamp);

            mousedown = false;

          }, false);

          this.__container.addEventListener("mousewheel", function(e) {
            if(that.__options.zooming) {
              that.__scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);  
              e.preventDefault();
            }
          }, false);
        }
      }
    }
  });
})();
