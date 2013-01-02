
@task
def source():
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
    
    # Resolving dependencies
    classes = Resolver(session).addClassName("test.Main").getSortedClasses()
    
    for permutation in session.permutate():
        # Writing source loader
        outputManager.storeLoader(classes, "$prefix/script/test-$permutation.js")


@task
def build():
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

    # Resolving dependencies
    classes = Resolver(session).addClassName("test.Main").getSortedClasses()

    # Compressing classes
    for permutation in session.permutate():
        outputManager.storeCompressed(classes, "$prefix/script/test-$permutation.js")

    
@task
def phantom():
    """Automatically executes source and build tests using PhantomJS"""

    from jasy.core.Util import executeCommand

    Console.info("Updating generated files...")
    source()
    build()

    Console.header("Task: Phantom - Continued")

    Console.info("Testing source...")
    output = executeCommand("phantomjs phantom.js", "Test Suite Failed", "source")
    Console.info("Finished successfully")

    Console.info("Testing build...")
    output = executeCommand("phantomjs phantom.js", "Test Suite Failed", "build")
    Console.info("Finished successfully")


    
@task
def node():
    """Automatically executes source and build tests using NodeJS"""

    from jasy.core.Util import executeCommand

    Console.info("Updating generated files...")
    source()
    build()

    Console.header("Task: Node - Continued")

    Console.info("Testing source...")
    output = executeCommand("node node.js", "Test Suite Failed", "source")
    Console.info("Finished successfully")

    Console.info("Testing build...")
    output = executeCommand("node node.js", "Test Suite Failed", "build")
    Console.info("Finished successfully")


@task
def clean():
    """Cleans up project environment"""

    session.clean()
    Repository.clean()


@task
def distclean():
    """Cleans up project environment with removing all non-repository files"""
    
    session.clean()
    Repository.distclean()
