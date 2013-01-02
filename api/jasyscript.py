
@task
def source():
    """Generates source (development) version of test runner"""

    # Configure
    session.setField("debug", True)

    # Initialize shared objects
    assetManager = AssetManager(session).addSourceProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0, formattingLevel=1)
    fileManager = FileManager(session)
    
    # Store kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)
    
    for permutation in session.permutate():
        # Resolving dependencies
        classes = Resolver(session).addClassName("core.api.Browser").getSortedClasses()

        # Writing source loader
        outputManager.storeLoader(classes, "$prefix/script/apibrowser-$permutation.js")


@task
def build():
    """Generates build (deployment) version of test runner"""

    # Configure
    session.setField("debug", False)

    # Initialize shared objects
    assetManager = AssetManager(session).addBuildProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=2)
    fileManager = FileManager(session)

    # Deploy assets
    outputManager.deployAssets(["core.api.Browser"])

    # Write kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)

    # Copy files from source
    fileManager.updateFile("source/index.html", "$prefix/index.html")

    for permutation in session.permutate():
        # Resolving dependencies
        classes = Resolver(session).addClassName("core.api.Browser").getSortedClasses()

        # Compressing classes
        outputManager.storeCompressed(classes, "$prefix/script/apibrowser-$permutation.js")
    

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
