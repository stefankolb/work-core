
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
    
    for permutation in session.permutate():
        # Resolving dependencies
        classes = Resolver(session).addClassName("test.Main").getSortedClasses()

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

    for permutation in session.permutate():
        # Resolving dependencies
        classes = Resolver(session).addClassName("test.Main").getSortedClasses()

        # Compressing classes
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
    print(output)

    Console.info("Testing build...")
    output = executeCommand("phantomjs phantom.js", "Test Suite Failed", "build")
    print(output)


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
    print(output)

    Console.info("Testing build...")
    output = executeCommand("node node.js", "Test Suite Failed", "build")
    print(output)


@task
def testem():
    """Automatically executes source and build tests using Testem test runner"""

    from jasy.core.Util import executeCommand
    import tempfile

    Console.info("Updating generated files...")
    source()
    build()

    Console.header("Task: Testem - Continued")

    sourceConfig = tempfile.NamedTemporaryFile("w")
    sourceConfig.write('{"framework": "custom", "test_page" : "test/source/index.html"}')

    buildConfig = tempfile.NamedTemporaryFile("w")
    buildConfig.write('{"framework": "custom", "test_page" : "test/build/index.html"}')

    Console.info("Testing source...")
    output = executeCommand("testem ci -f " + sourceConfig.name, "Test Suite Failed", "..")
    print(output)

    Console.info("Testing source...")
    output = executeCommand("testem ci -f " + buildConfig.name, "Test Suite Failed", "..")
    print(output)
    

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
