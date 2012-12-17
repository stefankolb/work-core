# Configure
session.setField("debug", True)


@task
def source():
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


@task
def build():
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

    # Resolving dependencies
    classes = Resolver(session).addClassName("test.Main").getSortedClasses()

    # Compressing classes
    outputManager.storeCompressed(classes, "$prefix/script/test.js")
    
    
@task
def phantom():
    # Initialize shared objects
    assetManager = AssetManager(session).addSourceProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0, formattingLevel=1)
    fileManager = FileManager(session)
    
    # Store kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)
    
    # Copy files from source
    fileManager.updateFile("source/phantom.js", "$prefix/phantom.js")
    fileManager.updateFile("source/phantom.html", "$prefix/phantom.html")

    # Process every possible permutation
    for permutation in session.permutate():

        # Resolving dependencies
        classes = Resolver(session).addClassName("test.Main").getSortedClasses()
        
        # Writing source loader
        outputManager.storeLoader(classes, "$prefix/script/test-$permutation.js", "phantomQunit();", urlPrefix="../source")

    # Execute test
    Console.info("Running QUnit...")
    import jasy.core.Util
    result = None
    try:
        result = jasy.core.Util.executeCommand("phantomjs phantom.js", "Tests did not ececute successfully", "phantom")
    except Exception:
        pass

    Console.info("QUnit Finished")
    print(result)



@task
def clean():
    session.clean()
    Repository.clean()


@task
def distclean():
    session.clean()
    Repository.distclean()
