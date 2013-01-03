
@task
def clean():
    """Clear build cache"""

    session.clean()

@task
def api():
    """Build the API viewer application"""

    core.api()
