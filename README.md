### Test & Analysis

For my continuous integration build/test tool, I chose to use [Jenkins](http://jenkins-ci.org/).  This takes care of the status
(via GUI) portion automatically.  Jenkins plugins for Git/Github allowed me to configure triggered 
builds when new commits are made to the master branch of the target application.

Application used: [GoundsIO](https://github.com/grounds/grounds.io) was selected as the application to
be built and tested.  It is a project which allows one to run code directly from the browser, and supports
multiple different languages (see [website](http://beta.42grounds.io/)).  More interestingly, the project
uses docker containers to run the application.  I chose this project primarily for this reason because
state is restored back to an initial starting point with each run (satisfying the clean state
requirement).

Jenkins supports running multiple builds via "executors."  This was easily configured, and in my case,
I chose to have three executors.

### Screenshots/Associated Functions

#### Tests and Coverage Reporting

Here, I am using the ![SimpleCov gem](https://github.com/colszowka/simplecov) to produce coverage reports.  The project already uses rspec for testing. I added the simplecov gem to the Gemfile and now I am able to automateically generate reports in an html format that is easily viewable via Jenkins (coverage is based on the rspec tests run).

![Test Coverage](images/test_cov.png "Test Coverage")
  
#### Analysis

For static analysis, I am using ![Brakeman](https://github.com/presidentbeef/brakeman), a well-known vulnerability analysis tool.

![Security Static Analysis - Brakeman](images/brakeman_results.png "Brakeman")

Sample build - Brakeman reporting 0 warnings.  Despite it being successful (no vulnerabilities found),
the exclamation point icon makes it look like a warning.  This seems like an odd choice for "success",
but I left it 'as is' for now - it may be configurable.

**Sample Brakeman log output:**
![Brakeman output](images/brakeman_running.png "Brakeman output")

#### Gate (Reject/warn PR on fail)

**Success:**
![Pull Request - Build Success](images/build_passed.png "Pull Request - Build Success")

**Pending:**
![Pull Request - Build Pending](images/build_pending.png "Pull Request - Build Pending")

**Failed:**
![Pull Request - Build Failed](images/build_fail.png "Pull Request - Build Failed")


Note: I chose to leave it marked as caution/building, as opposed to completely rejecting and 
closing the pull request.  This leaves more control available to the developer. They can
choose whether to reject or merge in the event of experimental changes or other scenarios
where it is okay for master to be broken (this shouldn't normally be the case, but having the option
is still nice).

### Code (config)

  - The config.xml file which contains the configuration for the build has been included [here](https://github.com/Druotic/devops-project/blob/milestone2/config.xml).

