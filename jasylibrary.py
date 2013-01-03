import jasy.core.Console as Console

from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.asset.Manager import AssetManager
from jasy.js.Resolver import Resolver
from jasy.js.api.Writer import ApiWriter
from jasy.core.Util import executeCommand

import json
import tempfile

@share
def api():
  """Generates the API viewer for the current project"""

  sourceFolder = session.getProjectByName("core").getPath() + "/source/"

  # Configure fields
  session.setField("debug", False)
  session.permutateField("es5")

  # Initialize shared objects
  assetManager = AssetManager(session).addBuildProfile()
  outputManager = OutputManager(session, assetManager, compressionLevel=2)
  fileManager = FileManager(session)

  # Deploy assets
  outputManager.deployAssets(["core.apibrowser.Browser"])

  # Write kernel script
  outputManager.storeKernel("$prefix/script/kernel.js", debug=True)

  # Copy files from source
  fileManager.updateFile(sourceFolder + "/apibrowser.html", "$prefix/index.html")
  
  # Rewrite template as jsonp
  for tmpl in ["main", "error", "entry", "type", "params", "info", "origin", "tags"]:
      jsonTemplate = json.dumps({ "template" : open(sourceFolder + "/tmpl/apibrowser/%s.mustache" % tmpl).read() })
      fileManager.writeFile("$prefix/tmpl/%s.js" % tmpl, "apiload(%s, '%s.mustache')" % (jsonTemplate, tmpl))
      
  # Process every possible permutation
  for permutation in session.permutate():
      
      # Resolving dependencies
      resolver = Resolver(session).addClassName("core.apibrowser.Browser")

      # Compressing classes
      outputManager.storeCompressed(resolver.getSortedClasses(), "$prefix/script/apibrowser-$permutation.js", "new core.apibrowser.Browser;")

  # Write API data
  ApiWriter(session).write("$prefix/data")


@share
def test_source():
    """Generates source (development) version of test runner"""

    session.setField("debug", True)
    session.permutateField("es5")
    session.permutateField("engine")
    session.permutateField("runtime")

    # Initialize shared objects
    assetManager = AssetManager(session).addSourceProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0, formattingLevel=1)
    fileManager = FileManager(session)
    
    # Store kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)
    
    for permutation in session.permutate():
        # Resolving dependencies
        classes = Resolver(session).addClassName("test.Main").getSortedClasses()

        # Writing source loader
        outputManager.storeLoader(classes, "$prefix/script/test-$permutation.js")


@share
def test_build():
    """Generates build (deployment) version of test runner"""

    session.setField("debug", True)
    session.permutateField("es5")
    session.permutateField("engine")
    session.permutateField("runtime")

    # Initialize shared objects
    assetManager = AssetManager(session).addBuildProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=2)
    fileManager = FileManager(session)

    # Deploy assets
    outputManager.deployAssets(["test.Main"])

    # Write kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)

    # Copy files from source
    fileManager.updateFile("source/index.html", "$prefix/index.html")
    fileManager.updateFile("source/phantom.js", "$prefix/phantom.js")
    fileManager.updateFile("source/node.js", "$prefix/node.js")

    for permutation in session.permutate():
        # Resolving dependencies
        classes = Resolver(session).addClassName("test.Main").getSortedClasses()

        # Compressing classes
        outputManager.storeCompressed(classes, "$prefix/script/test-$permutation.js")

    
@share
def test_phantom():
    """Automatically executes tests using PhantomJS"""

    prefix = session.getCurrentPrefix()

    Console.info("Testing %s via PhantomJS..." % prefix)
    output = executeCommand("phantomjs phantom.js", "Test Suite Failed", prefix)
    print(output)


@share
def test_node():
    """Automatically executes tests using NodeJS"""

    prefix = session.getCurrentPrefix()

    Console.info("Testing %s via NodeJS..." % prefix)
    output = executeCommand("node node.js", "Test Suite Failed", prefix)
    print(output)


@share
def test_testem():
    """Automatically executes tests using Testem"""

    prefix = session.getCurrentPrefix()

    testemConfig = tempfile.NamedTemporaryFile("w")
    testemConfig.write('{"framework": "custom", "test_page" : "test/%1/index.html"}' % prefix)

    Console.info("Testing %s via Testem..." % prefix)
    output = executeCommand("testem ci -f " + testemConfig.name, "Test Suite Failed", "..")
    print(output)

    

