
@task
def source():
    """Generates source (development) version of test runner"""
    core.test_source()

@task
def build():
    """Generates build (deployment) version of test runner"""
    core.test_build()
    
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

@task 
def test(target="source", tool="phantom"):
    """Automatically executes tests in either PhantomJS, NodeJS or Testem CI"""
    
    session.setCurrentPrefix(target)

    if target == "source":
        core.test_source()
    elif target == "build":
        core.test_build()
    else:
        Console.error("Unsupported target: %s" % target)        

    if tool == "phantom":
        core.test_phantom()
    elif tool == "node":
        core.test_node()
    elif tool == "testem":
        core.test_testem()
    else:
        Console.error("Unsupported tool: %s" % tool)
