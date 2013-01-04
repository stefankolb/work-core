import jasy.core.Console as Console
import jasy.vcs.Repository as Repository

from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.asset.Manager import AssetManager
from jasy.js.Resolver import Resolver
from jasy.js.api.Writer import ApiWriter

import os
import sys
import json
import tempfile
import shlex
import subprocess

def executeCommand(args, failMessage=None, path=None, wrapOutput=True):
    """
    Executes the given process and outputs failMessage when errors happen.

    :param args: 
    :type args: str or list
    :param failMessage: Message for exception when command fails
    :type failMessage: str
    :param path: Directory path where the command should be executed
    :type path: str
    :raise Exception: Raises an exception whenever the shell command fails in execution
    :type wrapOutput: bool
    :param wrapOutput: Whether shell output should be wrapped and returned (and passed through to Console.debug())
    """

    if type(args) == str:
        args = shlex.split(args)

    prevpath = os.getcwd()

    # Execute in custom directory
    if path:
        path = os.path.abspath(os.path.expanduser(path))
        os.chdir(path)

    Console.debug("Executing command: %s", " ".join(args))
    Console.indent()
    
    # Using shell on Windows to resolve binaries like "git"
    if not wrapOutput:
        returnValue = subprocess.call(args, shell=sys.platform == "win32")
        result = returnValue

    else:
        output = tempfile.TemporaryFile(mode="w+t")
        returnValue = subprocess.call(args, stdout=output, stderr=output, shell=sys.platform == "win32")
            
        output.seek(0)
        result = output.read().strip("\n\r")
        output.close()

    # Change back to previous path
    os.chdir(prevpath)

    if returnValue != 0 and failMessage:
        raise Exception("Error during executing shell command: %s (%s)" % (failMessage, result))
    
    if wrapOutput:
        for line in result.splitlines():
            Console.debug(line)
    
    Console.outdent()
    
    return result


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
def clean():
    """Deletes generated JavaScript files, the build folder and clears all caches."""

    session.clean()

    fm = FileManager(session)

    fm.removeDir("build")
    fm.removeDir("source/script")

@share
def distclean():
    """Deletes all generated folders like api, build, external and all caches."""

    session.clean()
    Repository.distclean()

    fm = FileManager(session)
    session.close()

    fm.removeDir("build")
    fm.removeDir("source/script")

    fm.removeDir("api")
    fm.removeDir("external")    


@share
def test_source(main="test.Main"):
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
        classes = Resolver(session).addClassName(main).getSortedClasses()

        # Writing source loader
        outputManager.storeLoader(classes, "$prefix/script/test-$permutation.js")


@share
def test_build(main="test.Main"):
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
    outputManager.deployAssets([main])

    # Store kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)

    # Copy files from source
    for name in ["index.html", "phantom.js", "node.js"]:
        fileManager.updateFile("source/%s" % fileName, "$prefix/%s" % fileName)

    for permutation in session.permutate():

        # Resolving dependencies
        classes = Resolver(session).addClassName(main).getSortedClasses()

        # Compressing classes
        outputManager.storeCompressed(classes, "$prefix/script/test-$permutation.js")

    
def test_phantom():
    """Automatically executes tests using PhantomJS"""

    prefix = session.getCurrentPrefix()

    Console.info("")
    Console.info("Running PhantomJS based test suite...")
    retval = executeCommand("phantomjs phantom.js", path=prefix, wrapOutput=False)
    Console.info("")

    return retval


def test_node():
    """Automatically executes tests using NodeJS"""

    prefix = session.getCurrentPrefix()

    Console.info("")
    Console.info("Running NodeJS based test suite...")
    retval = executeCommand("node node.js", path=prefix, wrapOutput=False)
    Console.info("")

    return retval


def test_testem(browsers=None, root=".."):
    """
    Automatically executes tests using Testem.

    Using a comma separated list of `browsers` one can define which browsers to use. By default
    Testem will use all browsers it finds on the system. The list could be printed out on screen
    using `testem launchers`.

    The `root` needs to be the folder where the testem files should be executed in which
    needs to be the folder which contains all the other relevant files for the project. Typically
    when you use the convention of a `test` folder inside your real project just use the default `..`
    which points to the "real" project's root folder.
    """

    prefix = session.getCurrentPrefix()

    # We need to use a full temporary directory and even a named temporary file
    # is not being guaranteed able to be accessed a second time.
    configDir = tempfile.TemporaryDirectory()
    pagePath = os.path.join("test", prefix, "index.html")
    
    testemConfig = open(os.path.join(configDir.name, "testem.json"), "w")
    testemConfig.write('{"framework": "custom", "test_page" : "' + pagePath + '"}')
    testemConfig.close()

    # Add parameter for browsers - otherwise auto-detected
    if browsers:
        browsers = "-l %s" % browsers
    else:
        browsers = ""

    Console.info("")
    Console.info("Running Testem based test suite...")

    # We execute the testem command in the root of the project
    retval = executeCommand("testem ci " + browsers + " -f " + testemConfig.name, path=root, wrapOutput=False)
    Console.info("")

    return retval


@share
def test(target="source", tool="phantom", browsers=None, main="test.Main"):
    """Automatically executes tests in either PhantomJS, NodeJS or Testem CI"""
    
    session.setCurrentPrefix(target)

    if target == "source":
        test_source(main=main)
    elif target == "build":
        test_build(main=main)
    else:
        Console.error("Unsupported target: %s" % target)    

    if tool == "phantom":
        test_phantom()
    elif tool == "node":
        test_node()
    elif tool == "testem":
        test_testem(browsers)
    else:
        Console.error("Unsupported tool: %s" % tool)

