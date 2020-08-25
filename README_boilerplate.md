# Boilerplate for Node Libraries

This is the boilerplate to create Node libraries.



## Configuration Steps

Follow:

- configure the **tmuxinator profile** and install it;

- initialise **Git** and **Git Flow**;

- configure **package.json** and make initial install.



## Publishing Workflow

Steps:

- test **npm run build**;

- close the Git Flow feature and go back to **develop**;

- test **npm pack**;

- test **npm publish**, changing version at **package.json** and **package-lock.json** if needed;

- if applicable, create a new Git Flow Release;

- push all branches and tags to GitLab;

- create a new Release at GitLab from the last **master**.