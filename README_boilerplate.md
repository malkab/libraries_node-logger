# Boilerplate for Node Libraries

This is the boilerplate to create Node libraries.



## Configuration Steps

Follow:

- configure the **tmuxinator profile** and install it;

- initialise **Git** and **Git Flow**;

- configure **package.json** and make initial install.



## Publishing Workflow

Steps:

- update package **README.md** and the description at **package.json**, if applicable;

- test **npm run build**;

- test **npm pack**;

- test **npm publish**;

- changing version with **npm version** if needed;

- close the Git Flow feature and go back to **develop**, if any;

- if applicable, create a new Git Flow Release;

- push all branches and tags to GitLab;

- create a new Release at GitLab from the last **master**.
