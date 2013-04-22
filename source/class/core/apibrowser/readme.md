Application code for API Browser for *Core* based applications and libraries. *Core* offers a built-in method to be called from any *Jasy* task to generate the matching API data and application code: 

```python
@task
def api():
    """Build the API viewer application"""

    core.api()
```
