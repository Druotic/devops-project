### Special Milestone

Application used: [GroundsIO](https://github.com/grounds/grounds.io) was selected as the application to
be built and tested.  It is a project which allows one to run code directly from the browser, and supports
multiple different languages (see [website](http://beta.42grounds.io/)).  More interestingly, the project
uses docker containers to run the application.  I chose this project primarily for this reason because
state is restored back to an initial starting point with each run (satisfying the clean state
requirement).

If you would like to see details about CI tool, deployment strategy, testing, etc, see milestone[1-3]
branches.

Application Pre-reqs (listening server + graphing): see [RUN.md](RUN.md)


For my special milestone, I have implemented a solution which analyzes the code that is entered inside
of the GroundsIO web console (and submitted).  It identifies keywords, counts the total number of occurrences,
and stores this information in a Redis cache.  I added an AJAX request that will trigger when clicking the run button. This change is in [gui.js](gui.js), which is from the original GroundsIO project. The function (with ajax addition) is as follows:

    this.button.run.on('click', function(event) {
        self.disableRunButtonFor(500);
        $.ajax({
            type: 'POST',
            url: 'http://52.24.0.69:3007/snippet',
            data: self.ground.getAttributes(),
            dataType: 'json',
            crossDomain: true
        });
          self.client.send('run', self.ground.getAttributes());
    });

For simplicity/demonstrative purposes, I hardcoded the IP/port number here.  Once, code is submitted and the run button is clicked, a `POST /snippet` request is sent to the server I created which will be listening on the above IP/port.  This server then uses AlchemyAPI's [API](http://www.alchemyapi.com/) to extract keywords from the source code.  The extracted keywords and counts are stored in Redis.  If `GET /graph` is accessed (i.e. `52.24.0.69:3007/graph` in this case), then the keywords and counts are graphed in a bar chart using Plotly's [API](https://plot.ly/python/bar-charts/).  Upon completion, a redirect to the Plotly graph occurs, displaying the resulting bar graph.

### In Action

Screenshots/small descriptions here.


### Motivation & Limitations

In a production environment (where many users are using GroundsIO), we would be able to collect lots of
sample code.  With this keyword extraction and visualization of usage, we could potentially identify areas of
each language that are some combination of commonly used, important, less understood, difficult
conceptually, etc.  With this knowledge, introductory language instructors could better adjust their
curriculumn to focus on the parts of a language that are most important and/or difficult. In theory,
this would result is more effective instructors and better prepare student for their future.

However, you may have noticed the limitations of the keyword extraction.  Currently, [AlchemyAPI](http://www.alchemyapi.com/)
is being used for keyword extraction.  AlchemyAPI's keyword/entity extraction is
really meant to be used for human languages, not coding languages. As a result, the keywords being
extracted aren't exactly what we want.  However, it is a starting point that is meant to demonstrate
the idea and could later be built upon by replacing AlchemyAPI with a more appropriate NLP tool.


### Code 

- [helpers/](helpers/)
- [index.js](index.js) and corresponding [package.json](package.json)
- modified [gui.js](gui.js)

##### Config - Left from Previous Milestones for Reference

  - [config.xml](config.xml) has been included. This is the Jenkins configuration file.

  - [appspec.yml](appspec.yml) has also been included, which is used by AWS CodeDeploy for configuration management.
