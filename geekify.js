#!/usr/bin/env node

var program = require('commander');
var geekHandler = require("./lib/handlers");

program
    .version('0.0.1')

program
    .command('init')
    .description('Reset all changes and Initialize')
    .action(function(name) {
        geekHandler.printLibName();
        geekHandler.geekPerformInitAction().then(function() {
            console.log("Init done")
        }, function(err) {
            console.error("geekPerformInitAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });

program
    .command('reset')
    .description('Reset all changes')
    .action(function(name) {
        geekHandler.printLibName();
        geekHandler.geekPerformResetAction().then(function() {
            console.log("Reset done")
        }, function(err) {
            console.error("geekPerformResetAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });

program
    .command('showdiff')
    .description('show diff between current and last commit - defined in geek.json file of current repository')
    .action(function(name) {
        geekHandler.geekPerformShowDiffAction().then(function() {
            console.log("Diff done")
        }, function(err) {
            console.error("geekPerformShowDiffAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });

program
    .command('next')
    .description('Jumt to Next Step - defined in geek.json file of current repository')
    .action(function(name) {
        geekHandler.geekPerformNextAction().then(function() {
            console.log("Next done")
        }, function(err) {
            console.error("geekPerformNextAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });

program
    .command('previous')
    .description('Jumt to Previous Step - defined in geek.json file of current repository')
    .action(function(name) {
        geekHandler.geekPerformPreviousAction().then(function() {
            console.log("Previous done")
        }, function(err) {
            console.error("geekPerformPreviousAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });


program.parse(process.argv);
