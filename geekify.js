#!/usr/bin/env node

var program = require('commander');
var geekHandler = require("./lib/handlers");

program
    .version('0.0.1')

program
    .command('init')
    .description('Reset all changes and Initialize')
    .action(function (name) {
        geekHandler.geekPerformInitAction()
    });

program
    .command('reset')
    .description('Reset all changes')
    .action(function (name) {
        geekHandler.geekPerformResetAction()
    });

program
    .command('showdiff')
    .description('show diff between current and last commit - defined in geek.json file of current repository')
    .action(function (name) {
        geekHandler.geekPerformShowDiffAction()
    });

program
    .command('next')
    .description('Jump to Next Step - defined in geek.json file of current repository')
    .action(function (name) {
        geekHandler.geekPerformNextAction()
    });

program
    .command('previous')
    .description('Jump to Previous Step - defined in geek.json file of current repository')
    .action(function (name) {
        geekHandler.geekPerformPreviousAction()
    });

program
    .command('jumpto <branchName>')
    .description('Jump to specific Step - defined in geek.json file of current repository')
    .action(function (branchName) {
        geekHandler.geekPerformJumpToAction(branchName)
    });

program.parse(process.argv);
