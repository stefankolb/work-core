#
# This is the jasyscript.py of $${name} file. 
# This file defines tasks for the Jasy build tool we use for development and deployment of $${name}.
#

@task
def clean():
    """Clear build cache"""
    
    core.clean()


@task
def distclean():
    """Clear caches and build results"""
    
    core.distclean()


@task
def api():
    """Build API viewer"""
    
    core.api()
    
    
@task
def server():
    """Start HTTP server"""
    
    session.pause()
    Server().start()
    session.resume()


@task
def source():
    """Generate source (development) version"""

    # Configure build
    session.setField("debug", True)
    # session.setLocales(["en", "de"])

    # Initialize shared objects
    assetManager = AssetManager(session).addSourceProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0, formattingLevel=2)
    fileManager = FileManager(session)
    
    # Store kernel script
    outputManager.storeKernel("{{prefix}}/script/kernel.js", bootCode="$${name}.Kernel.boot();")
    
    # Process every possible permutation
    for permutation in session.permutate():

        # Resolving dependencies
        classes = Resolver(session).addClassName("$${name}.Main").getSortedClasses()
        
        # Writing source loader
        outputManager.storeLoader(classes, "{{prefix}}/script/$${name}-{{id}}.js", "new $${name}.Main();")


@task
def build():
    """Generate deployable and combined build version"""

    # Configure build
    session.permutateField("debug", True)
    # session.setLocales(["en", "de"])

    # Initialize shared objects
    assetManager = AssetManager(session).addBuildProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=2)
    fileManager = FileManager(session)

    # Deploy assets
    outputManager.deployAssets(["$${name}.Main"])

    # Write kernel script
    outputManager.storeKernel("{{prefix}}/script/kernel.js", bootCode="$${name}.Kernel.boot();")

    # Copy files from source
    fileManager.updateFile("source/index.html", "{{prefix}}/index.html")

    # Process every possible permutation
    for permutation in session.permutate():

        # Resolving dependencies
        classes = Resolver(session).addClassName("$${name}.Main").getSortedClasses()

        # Compressing classes
        outputManager.storeCompressed(classes, "{{prefix}}/script/$${name}-{{id}}.js", "new $${name}.Main();")

