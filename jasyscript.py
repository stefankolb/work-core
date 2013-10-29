
@task
def clean():
    """Clear build cache"""

    session.clean()

@task
def api():
    """Build the API viewer application"""

    core.api()

@task
def hint():
    """Executes JSHint for source code hinting"""

    print(executeCommand("jshint source/class"))
