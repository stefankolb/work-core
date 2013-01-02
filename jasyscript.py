# Core - JavaScript Foundation

session.permutateField("es5")
session.permutateField("debug")

@task
def clean():
    """Clear build cache"""

    session.clean()


@task
def distclean():
    """Clears caches and build results"""

    session.clean()


@task
def api(theme="original"):
    """Build the API viewer application"""

    import json

    # Configure fields
    session.setField("debug", False)
    session.setField("apibrowser.theme", theme)
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
    fileManager.updateFile("source/apibrowser.html", "$prefix/index.html")
    
    # Rewrite template as jsonp
    for tmpl in ["main", "error", "entry", "type", "params", "info", "origin", "tags"]:
        jsonTemplate = json.dumps({ "template" : open("source/tmpl/apibrowser/%s.mustache" % tmpl).read() })
        fileManager.writeFile("$prefix/tmpl/%s.js" % tmpl, "apiload(%s, '%s.mustache')" % (jsonTemplate, tmpl))
        
    # Process every possible permutation
    for permutation in session.permutate():
        
        # Resolving dependencies
        resolver = Resolver(session).addClassName("core.apibrowser.Browser")

        # Compressing classes
        outputManager.storeCompressed(resolver.getSortedClasses(), "$prefix/script/apibrowser-$permutation.js", "new core.apibrowser.Browser;")

    # Write data
    ApiWriter(session).write("$prefix/data")
