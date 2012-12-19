@task
def source():
    return _source()

@task
def build():
    return _build()

def _source():
    session.setField("debug", True)

    # Initialize shared objects
    assetManager = AssetManager(session).addSourceProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0, formattingLevel=1)
    fileManager = FileManager(session)
    
    # Store kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)
    
    # Resolving dependencies
    classes = Resolver(session).addClassName("test.Main").getSortedClasses()
    
    # Writing source loader
    outputManager.storeLoader(classes, "$prefix/script/test.js")


def _build():
    session.setField("debug", True)

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

    # Resolving dependencies
    classes = Resolver(session).addClassName("test.Main").getSortedClasses()

    # Compressing classes
    outputManager.storeCompressed(classes, "$prefix/script/test.js")
    
    
@task
def test():
    """Automatically tests using PhantomJS"""

    from jasy.core.Util import executeCommand

    Console.info("Testing source...")
    Console.indent()
    Console.info("Updating source task...")
    Console.indent()
    _source()
    Console.outdent()
    Console.info("Executing PhantomJS...")
    output = executeCommand("phantomjs phantom.js", "Test Suite Failed")
    Console.info("Tests finished successfully")
    Console.outdent()

    Console.info("Testing build...")
    Console.indent()
    Console.info("Updating build task...")
    Console.indent()
    _build()
    Console.outdent()
    Console.info("Executing PhantomJS...")
    output = executeCommand("phantomjs phantom.js", "Test Suite Failed")
    Console.info("Tests finished successfully")
    Console.outdent()


@task
def clean():
    session.clean()
    Repository.clean()


@task
def distclean():
    session.clean()
    Repository.distclean()
