### Pre-reqs:

- Redis up and running. 
- Plotly api key/authentication is setup properly see https://plot.ly/python/getting-started
  i.e. be sure ~/.plotly/.credentials is present with your credentials


### Install dependencies:

    npm install
    sudo pip install -r helpers/requirements.txt

### Run:

    node index.js


Note: application will listen on port 3007, awaiting a) code snippets to POST /snippet or b) graph
request to POST /graph. See [README.md](README.md) for more info.
