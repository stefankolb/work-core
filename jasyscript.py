# Core - JavaScript Foundation

session.permutateField("es5")
session.permutateField("debug")

@task
def clean():
    """Clear build cache"""

    session.clean()


@task
def distclean():
    """Clears caches and build results"""

    session.clean()


@task
def api():
    """Build the API viewer application"""

    core.api()
