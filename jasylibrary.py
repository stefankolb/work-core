import jasy.core.Console as Console
import jasy.vcs.Repository as Repository

from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.asset.Manager import AssetManager
from jasy.js.Resolver import Resolver as ScriptResolver
from jasy.js.api.Writer import ApiWriter
from jasy.core.Util import executeCommand

# NEW
import jasy.core.Profile as Profile
import jasy.core.BuildTool as BuildTool

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

    fm = FileManager()

    fm.removeDir("build")
    fm.removeDir("source/script")


@share
def distclean():
    """Deletes all generated folders like api, build, external and all caches."""

    session.clean()
    Repository.distclean()
    session.close()

    fm = FileManager()

    fm.removeDir("build")
    fm.removeDir("source/script")

    fm.removeDir("api")
    fm.removeDir("external")


def test_phantom(profile):
    """Automatically executes tests using PhantomJS"""

    Console.info("")
    Console.info("Running PhantomJS based test suite...")
    retval = executeCommand("phantomjs phantom.js", path=profile.getDestinationPath(), wrapOutput=False)
    Console.info("")

    return retval


def test_node(profile):
    """Automatically executes tests using NodeJS"""

    Console.info("")
    Console.info("Running NodeJS based test suite...")
    retval = executeCommand("node node.js", path=profile.getDestinationPath(), wrapOutput=False)
    Console.info("")

    return retval


def test_testem(profile, target="source", browsers=None, root="../"):
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
def test(target="source", tool="phantom", browsers=None, main="test.Main", kernel="test.Kernel"):
    """
    Automatically executes tests in either PhantomJS, NodeJS or via Testem CI
    """

    # Initialize profile
    profile = Profile.Profile(session)
    profile.registerPart("kernel", className=kernel)
    profile.registerPart("main", className=main)

    # Destination should match target name
    profile.setDestinationPath(target)

    if target == "source":

        # Force debug enabled
        profile.setField("debug", True)

        # Load all scripts/assets from source folder
        profile.setUseSource(True)

        # Start actual build
        BuildTool.run(profile)

    elif target == "build":

        # Copy assets
        profile.setCopyAssets(True)

        # Start actual build
        BuildTool.run(profile)

        # Copy files from source
        for name in ["index.html", "testem.html", "phantom.js", "node.js"]:
            fileManager.updateFile("source/%s" % fileName, "{{prefix}}/%s" % fileName)

    else:

        Console.error("Unsupported target: %s" % target)

    if tool == "phantom":
        return test_phantom(profile)
    elif tool == "node":
        return test_node(profile)
    elif tool == "testem":
        return test_testem(profile, target, browsers)
    else:
        Console.error("Unsupported tool: %s" % tool)

