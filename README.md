### Deployment

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

For deployment, I am using AWS CodeDeploy (with EC2), AWS S3, and the Jenkin AWS CodeDeploy plugin.

### Screenshots/Associated Functions

- Automatic deployment environment configuration:

This is handled by AWS CodeDeploy's appspec.yml file.  In this file, configuration management details are specified (pre-install dependencies, etc).

- Deployment of binaries created by build step:

The Jenkins AWS CodeDeploy plugin zips the build artifacts (the entire workspace) and pushes it to AWS S3.

- Remote deployment:

The Jenkins AWS CodeDeploy plugin then triggers a deployment to EC2 instances. The deployment setup is configured on the AWS CodeDeploy side.  In my case, I have 3 EC2 instances
which are all deployed to in parallel (there are other deployment configurations available as well).  Deployment steps are defined in an Appspec file.

### Code (config)

  - The config.xml file which contains the configuration for the build (on jenkins) has been included [here](https://github.com/Druotic/devops-project/blob/milestone3/config.xml).

