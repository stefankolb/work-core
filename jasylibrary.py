import jasy.core.Console as Console
import jasy.vcs.Repository as Repository

from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.asset.Manager import AssetManager
from jasy.js.Resolver import Resolver as ScriptResolver
from jasy.js.api.Writer import ApiWriter
from jasy.core.Util import executeCommand

import os
import sys
import json
import tempfile
import shlex
import subprocess


@share
def api():
    """Generates the API viewer for the current project"""

    sourceFolder = session.getProjectByName("core").getPath() + "/source/"

    # Configure fields
    session.setField("debug", False)

    # Initialize shared objects
    assetManager = AssetManager(session).addBuildProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=2)
    fileManager = FileManager(session)

    # Deploy assets
    outputManager.deployAssets(["core.apibrowser.Browser"])

    # Write kernel script
    outputManager.storeKernelScript("{{prefix}}/script/kernel.js", bootCode="core.apibrowser.Kernel.init();")

    # Copy files from source
    fileManager.updateFile(sourceFolder + "/apibrowser.html", "{{prefix}}/index.html")

    # Rewrite template as jsonp
    for tmpl in ["main", "error", "entry", "type", "params", "info", "origin", "tags"]:
        jsonTemplate = json.dumps({ "template" : open(sourceFolder + "/tmpl/apibrowser/%s.mustache" % tmpl).read() })
        fileManager.writeFile("{{prefix}}/tmpl/%s.js" % tmpl, "apiload(%s, '%s.mustache')" % (jsonTemplate, tmpl))

    # Process every possible permutation
    for permutation in session.permutate():

        # Resolving dependencies
        resolver = ScriptResolver(session).add("core.apibrowser.Browser")

        # Compressing classes
        outputManager.storeCompressedScript(resolver.getSorted(), "{{prefix}}/script/apibrowser-{{id}}.js", "new core.apibrowser.Browser;")

    # Write API data
    ApiWriter(session).write("{{prefix}}/data")


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
    session.permutateField("json")
    session.permutateField("engine")
    session.permutateField("runtime")

    # Initialize shared objects
    assetManager = AssetManager(session).addSourceProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0, formattingLevel=1)
    fileManager = FileManager(session)

    # Store kernel script
    outputManager.storeKernelScript("{{prefix}}/script/kernel.js", bootCode="test.Kernel.init();")

    for permutation in session.permutate():

        # Resolving dependencies
        classes = ScriptResolver(session).add(main).getSorted()

        # Writing source loader
        outputManager.storeLoaderScript(classes, "{{prefix}}/script/test-{{id}}.js")


@share
def test_build(main="test.Main"):
    """Generates build (deployment) version of test runner"""

    session.setField("debug", True)
    session.permutateField("json")
    session.permutateField("engine")
    session.permutateField("runtime")

    # Initialize shared objects
    assetManager = AssetManager(session).addBuildProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=2)
    fileManager = FileManager(session)

    # Deploy assets
    outputManager.deployAssets([main])

    # Store kernel script
    outputManager.storeKernelScript("{{prefix}}/script/kernel.js", bootCode="test.Kernel.init();")

    # Copy files from source
    for name in ["index.html", "testem.html", "phantom.js", "node.js"]:
        fileManager.updateFile("source/%s" % fileName, "{{prefix}}/%s" % fileName)

    for permutation in session.permutate():

        # Resolving dependencies
        classes = ScriptResolver(session).add(main).getSorted()

        # Compressing classes
        outputManager.storeCompressedScript(classes, "{{prefix}}/script/test-{{id}}.js")


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


def test_testem(target="source", browsers=None, root="../"):
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

    # Add parameter for browsers - otherwise auto-detected
    browsers = "-l %s" % browsers if browsers else ""

    Console.info("")
    Console.info("Running Testem based test suite...")

    # We execute the testem command in the root of the project
    retval = executeCommand("testem ci " + browsers + " -f test/testem-" + target + ".json", path=root, wrapOutput=False)
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
        return test_phantom()
    elif tool == "node":
        return test_node()
    elif tool == "testem":
        return test_testem(target, browsers)
    else:
        Console.error("Unsupported tool: %s" % tool)

