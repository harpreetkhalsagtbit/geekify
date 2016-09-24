Geekify.js
===================
A node.js utility for making interactive tutorial using node.js cli utility and a few basic git commands 

----------

Scope
-------------
We are planning to make a utility whose main task would be to allow a Geek/Learner go-through step-by-step of anything Code/Program developed with git using git commits/tags. It could be either a tutorial, a running code demo, a book anything which is defined in phases using git commits or tags.

Basically it is a:

> A CLI based node.js program that can serve infinite number of purposes **(Live Demo/ Tutorial/ Book/Lecture)** not for node.js but for other programming languages, that I am unaware of at the moment but community can help better.


Main Utility
=========
It should be a simple **cli-based** application **Geekify** developed using nodejs **commander.js** package capable of running some **git commands** from within and follow operations as suggested by a JSON file **geekify.json** written in a predefined format, specifically for one particular **git code repository** from which **cli-command** has been triggered similar as running **gruntfile.js** using **grunt** command from a code repository

For initial Versions we are focusing on **node.js projects** and other web based tutorials for **HTML/CSS/JS**


Development Main Utility
===========

1. **Learn** commander.js
2. **Learn** shell.js
3. **Automate** Test cases - *General Open Souce Projects Ops work*
4. **Learn Auto Build/Check/Review Pull request** - use of Travis CJ and etc github plugins - *General Open Souce Projects Ops work*
5. **Autorefresh** - Client and Server


geekify.json
========
	
	{
	    "branches": [
	        "step1",
	        "step2",
	        "step3",
	        "step4"
	    ],
	    "index": 0,
	    "initialBranch": "step1",
	    "main_server": "server.js"
	}


How to create **geekify** specific Github repository 
======

What does **geekify** specific mean **?**
----
Our aim is to teach geek about anything in a step-by-step process, for this we are using git commands and it will perform necessary git checkout's for every step and to help the geek to prevent himself from getting irritated by refreshing again and again we will be doing auto-refresh for each step.
  
 So geek specific means - including those dependencies in your code  code which will auto-refresh itself for every change in their code repository.

what kind of dependencies?
---

1. `npm install -g supervisor` from [here](https://www.npmjs.com/package/supervisor)
2. `npm install reload` from [here](https://www.npmjs.com/package/reload)


And, use them in your code as mentioned [here](https://www.npmjs.com/package/supervisor) and example below

**server.js**

    <your code here>
    .
    .
    .
    
        var reload = require('reload')
      

    <your code here>

        //reload code here 
        reload(server, app, 2500)
         
    .
    .
    .
    <your code here>


**client.js**

        <!doctype html>
        <meta charset="utf-8">
        <title>My app!</title>
    
        <your code here>
    .
    .
    .
        <script src="/reload/reload.js"></script> 
    .
    .
    .    
        <h1>Hello! me</h1>
        <h1>Hello! you</h1>
        <h1>Hello! to all</h1>


Demo Tutorial
===
1. **Web Based** - Client and Server using node.js. **eg: Express.js Routing** tutorial.

2. **Server Only**  - node.js. **eg: My own Async.js, node-mysql etc.**

3. **Client side only** - HTML/CSS/JS.

4. **Web Based 3rd Party Tutorial** - Client and Server node.js. **eg: Geekifying - You Don't Know JS** tutorial. After taking permission form Original Author.

Demo tutorial will help us refinig our requirement and work flow of **geekify cli**


geekify commands
====
1. **Reset** (Checkout to main git branch)
2. **Init** (Initialize + Reset)
3. **Next** (Checkout to Next git commit)
4. **Previous** (Checkout to Previous git commit)
5. **Run** (Run code - server.js)
6. **ShowDiff** (Change in code between current and previous git commit)
7. **Jump** (Jump to particular git commit)
8. **validate** (validate JSON file - geekify.json)


Best way to write geek.json file
========

To prevent use from overhead of maintaining a geek.json file, we need to follow a process, with this, we don't have to worry about inevitable changes in any branches. Geekify will automatically creates or read your geek.json file

How?
======

1. Create your main branch - **master**
2. Add **.gitignore** file and add **geek.json** file in it and git commit and push all changes to **master** branch.
3. create a config branch - **geek-config**.
4. Save your **geek.config.json** file in this branch and **git commit and push** you **geek-config** branch.
5. Switch back to **master** branch and Follow your steps for writing tutorial as you want and **create separate branches** for each step.
6. Update **geek.config.json** file accordingly under **geek-config** branch only.
7. Run command - **geek reset**
8. **geek reset** will automatically shift you to the **geek-config** branch and will copy content of **geek.config.json** and create a file **geek.json** with all the configuration you have defined under your **geek.config.json** file.
9. Now you can freely, move **forwad and backward** to your tutorial steps without taking worry about content of **geek.json** file which is marked as **.gitignore** and hence we will always have the availability of geek.json file for our geekify commander.


Features To Be Added:
=====

1. Show Folder Structure
2. Install Dependencies
3. Reading Stuff - Geekify Next
4. Display Tutorial Depending Actions like : Terminal Commands, Browser URL actions etc.
