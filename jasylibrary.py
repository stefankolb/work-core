from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.asset.Manager import AssetManager
from jasy.js.Resolver import Resolver
from jasy.js.api.Writer import ApiWriter

import json

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

