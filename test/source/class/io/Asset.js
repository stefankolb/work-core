var suite = new core.testrunner.Suite("IO/Asset");

suite.test("Image Sizes", function() {

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "myapp" : {
        "icons" : {
          "app.png" : {"d":[48, 48], "p":0, "t":"i"}
        }
      }
    }, 
    "profiles" : [{name:"build", "root":"asset/"}]
  });
  this.isEqual(jasy.Asset.toUri("myapp/icons/app.png"), "asset/myapp/icons/app.png");
  this.isEqual(core.io.Asset.getImageSize("myapp/icons/app.png")+"", [48, 48]+"");
  this.isEqual(core.io.Asset.getFrameNumber("myapp/icons/app.png"), 1);
  
});

  
suite.test("Image Sprite - None", function() {

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "myapp" : {
        "icons" : {
          "app.png" : {"d":[48, 48], "p":0, "t":"i"}
        }
      }
    }, 
    "profiles" : [{name:"build", "root":"asset/"}]
  });
  this.isEqual(jasy.Asset.toUri("myapp/icons/app.png"), "asset/myapp/icons/app.png");

  var imgData = core.io.Asset.getImage("myapp/icons/app.png");
  this.isIdentical(imgData.left, 0);
  this.isIdentical(imgData.top, 0);
  this.isIdentical(imgData.src, "asset/myapp/icons/app.png");
  
});
  
  
suite.test("Image Sprite - Same Folder", function() 
{

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "myapp" : {
        "icons" : {
          "app.png" : {"d":[48, 48, [0, 96, 240]], "p":0, "t":"i"},
          "icons.png" : {"d":[288, 288], "p":0, "t":"i"}
        }
      }
    }, 
    "profiles" : [{name:"build", "root":"asset/"}],
    "sprites" : ["icons.png"]
  });
  this.isEqual(jasy.Asset.toUri("myapp/icons/app.png"), "asset/myapp/icons/app.png");

  var imgData = core.io.Asset.getImage("myapp/icons/app.png");
  this.isIdentical(imgData.width, 48);
  this.isIdentical(imgData.height, 48);
  this.isIdentical(imgData.left, 96);
  this.isIdentical(imgData.top, 240);
  this.isIdentical(imgData.src, "asset/myapp/icons/icons.png");
});

  
suite.test("Image Sprite - Absolute ID", function() 
{

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "myapp" : {
        "icons.png" : {"d":[288, 288], "p":0, "t":"i"},
        "icons" : {
          "app.png" : {"d":[48, 48, [0, 96, 240]], "p":0, "t":"i"}
        }
      }
    }, 
    "profiles" : [{name:"build", "root":"asset/"}],
    "sprites" : ["myapp/icons.png"]
  });
  this.isEqual(jasy.Asset.toUri("myapp/icons/app.png"), "asset/myapp/icons/app.png");

  var imgData = core.io.Asset.getImage("myapp/icons/app.png");
  this.isIdentical(imgData.width, 48);
  this.isIdentical(imgData.height, 48);
  this.isIdentical(imgData.left, 96);
  this.isIdentical(imgData.top, 240);
  this.isIdentical(imgData.src, "asset/myapp/icons.png");
});  


suite.test("Image Sprite - Root ID", function() 
{
  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "icons.png" : {"d":[288, 288], "p":0, "t":"i"},
      "myapp" : {
        "icons" : {
          "app.png" : {"d":[48, 48, [0, 96, 240]], "p":0, "t":"i"}
        }
      }
    }, 
    "profiles" : [{name:"build", "root":"asset/"}],
    "sprites" : ["/icons.png"]
  });
  this.isEqual(jasy.Asset.toUri("myapp/icons/app.png"), "asset/myapp/icons/app.png");

  var imgData = core.io.Asset.getImage("myapp/icons/app.png");
  this.isIdentical(imgData.width, 48);
  this.isIdentical(imgData.height, 48);
  this.isIdentical(imgData.left, 96);
  this.isIdentical(imgData.top, 240);
  this.isIdentical(imgData.src, "asset/icons.png");

});
  
suite.test("Image Animation - Rows/Columns", function() {
  
  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : 
    {
      "myapp" : 
      {
        "anim" : 
        {
          "loading.png" : {"d":[16*16, 16, 0, [16, 1]], "p":0, "t":"i"},
          "explode.png" : {"d":[32*30, 32*3, 0, [30, 3]], "p":0, "t":"i"},
          "collapse.png" : {"d":[12*2, 12*20, 0, [2, 20, 86]], "p":0, "t":"i"},
        }
      }
    }, 
    "profiles" : [{name:"build", "root":"asset/"}]
  });
  
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/loading.png"), 16, "number of frames I");
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/explode.png"), 90, "number of frames II");
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/collapse.png"), 86, "number of frames III");
  
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 0).left, 0, "left position first");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 1).left, 16, "left position second");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).left, 208, "left position inner");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 15).left, 240, "left position last");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 0).top, 0, "top position first");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 1).top, 0, "top position second");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).top, 0, "top position inner");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 15).top, 0, "top position last");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/collapse.png", 2).left, 0, "left other image");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/collapse.png", 2).top, 12, "top other image");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).width, 16, "corrected width");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).height, 16, "corrected height");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).src, "asset/myapp/anim/loading.png", "normal source handling I");
  
  this.isIdentical(core.io.Asset.getImage("myapp/anim/loading.png").width, 256, "full image width");
  this.isIdentical(core.io.Asset.getImage("myapp/anim/loading.png").height, 16, "full image height");
  this.isIdentical(core.io.Asset.getImage("myapp/anim/loading.png").src, "asset/myapp/anim/loading.png", "normal source handling II");

});

  
suite.test("Image Animation - Rows/Columns in Image Sprite", function() {
  
  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : 
    {
      "myapp" : 
      {
        "sprite.png" : {"d":[960, 352], "p":0},
        "anim" : 
        {
          "loading.png" : {"d":[16*16, 16, [0, 20, 0], [16, 1]], "p":0, "t":"i"},
          "explode.png" : {"d":[32*30, 32*3, [0, 40, 16], [30, 3]], "p":0, "t":"i"},
          "collapse.png" : {"d":[12*2, 12*20, [0, 60, 112], [2, 20, 86]], "p":0, "t":"i"}
        }
      }
    }, 
    "profiles" : [{name:"build", "root":"asset/"}],
    "sprites" : ["myapp/sprite.png"]
  });
  
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/loading.png"), 16, "number of frames I");
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/explode.png"), 90, "number of frames II");
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/collapse.png"), 86, "number of frames III");
  
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 0).left, 20, "left position first");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 1).left, 36, "left position second");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).left, 228, "left position inner");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 15).left, 260, "left position last");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 0).top, 0, "top position first");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 1).top, 0, "top position second");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).top, 0, "top position inner");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 15).top, 0, "top position last");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/collapse.png", 2).left, 60, "left other image");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/collapse.png", 2).top, 124, "top other image");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).width, 16, "corrected width");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).height, 16, "corrected height");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/loading.png", 13).src, "asset/myapp/sprite.png", "normal source sprite handling I");
  
  this.isIdentical(core.io.Asset.getImage("myapp/anim/loading.png").width, 256, "full image width");
  this.isIdentical(core.io.Asset.getImage("myapp/anim/loading.png").height, 16, "full image height");
  this.isIdentical(core.io.Asset.getImage("myapp/anim/loading.png").src, "asset/myapp/sprite.png", "normal source sprite handling II");

});



suite.test("Image Animation - Custom", function()
{
  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : 
    {
      "myapp" : 
      {
        "anim" : 
        {
          "guy.png" : {"d":[200, 16, 0, [
            [
              // Format: left, top, width, height, offsetLeft?, offsetTop?, rotation?
              [ 0,  0, 20, 20],
              [30, 50, 10, 30, 20, 50],
              [70, 20, 14, 40, 0, 30, 90]
            ]
          ]], "p":0, "t":"i"}
        }
      },
    },
    "profiles" : [{name:"build", "root":"asset/"}]
  });
  
  
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/guy.png"), 3, "number of frames");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).left, 0, "left position I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).top, 0, "top position I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).width, 20, "width I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).height, 20, "height I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).offsetLeft, 0, "offsetLeft I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).offsetTop, 0, "offsetTop I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).rotation, 0, "rotation I");
  
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).left, 30, "left position II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).top, 50, "top position II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).width, 10, "width II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).height, 30, "height II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).offsetLeft, 20, "offsetLeft II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).offsetTop, 50, "offsetTop II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).rotation, 0, "rotation II");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).left, 70, "left position III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).top, 20, "top position III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).width, 14, "width III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).height, 40, "height III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).offsetLeft, 0, "offsetLeft III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).offsetTop, 30, "offsetTop III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).rotation, 90, "rotation III");
  
});


suite.test("Image Animation - Custom in Image Sprite", function()
{
  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : 
    {
      "myapp" : 
      {
        "sprite.png" : {"d":[960, 352], "p":0},
        "anim" : 
        {
          "guy.png" : {"d":[200, 16, [0, 20, 40], [
            [
              // Format: left, top, width, height, offsetLeft?, offsetTop?, rotation?
              [ 0,  0, 20, 20],
              [30, 50, 10, 30, 20, 50],
              [70, 20, 14, 40, 0, 30, 90]
            ]
          ]], "p":0, "t":"i"},
        }
      },
    },
    "sprites" : ["myapp/sprite.png"],
    "profiles" : [{name:"build", "root":"asset/"}]
  });
  
  
  this.isIdentical(core.io.Asset.getFrameNumber("myapp/anim/guy.png"), 3, "number of frames");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).left, 20, "left position I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).top, 40, "top position I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).width, 20, "width I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).height, 20, "height I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).offsetLeft, 0, "offsetLeft I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).offsetTop, 0, "offsetTop I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).rotation, 0, "rotation I");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 0).src, "asset/myapp/sprite.png", "source I");
  
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).left, 50, "left position II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).top, 90, "top position II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).width, 10, "width II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).height, 30, "height II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).offsetLeft, 20, "offsetLeft II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).offsetTop, 50, "offsetTop II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).rotation, 0, "rotation II");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 1).src, "asset/myapp/sprite.png", "source II");

  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).left, 90, "left position III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).top, 60, "top position III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).width, 14, "width III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).height, 40, "height III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).offsetLeft, 0, "offsetLeft III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).offsetTop, 30, "offsetTop III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).rotation, 90, "rotation III");
  this.isIdentical(core.io.Asset.getFrame("myapp/anim/guy.png", 2).src, "asset/myapp/sprite.png", "source III");
  
});

