
@task
def source():
    """Generates source (development) version of test runner"""
    core.test_source()
    node.generateLoader("source/test.js")