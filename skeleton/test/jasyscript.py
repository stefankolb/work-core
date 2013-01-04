
@task
def source():
    """Generates source (development) version of test runner"""
    
    core.test_source(main="$${name}.Main")

@task
def build():
    """Generates build (deployment) version of test runner"""

    core.test_build(main="$${name}.Main")

@task
def clean():
    """Cleans up project environment"""

    core.clean()
    
@task
def distclean():
    """Cleans up project environment with removing all non-repository files"""

    core.distclean()

@task 
def test(target="source", tool="phantom", browsers=None):
    """Automatically executes tests in either PhantomJS, NodeJS or Testem CI"""
    
    core.test(target, tool, browsers, main="$${name}.Main")
