const fs = require('fs-extra');

/**
 * Module dependencies.
 */
const mocha = require('mocha');
const Spec = mocha.reporters.Spec;
const Base = mocha.reporters.Base;

import {screenshot, splitPath} from './util';
import Spectreport from 'spectreport';
const Suite = Spectreport.Suite;
const Test = Spectreport.Test;

/**
 * Default values
 */
const defaults = {
    screenshotDir: 'test/screenshot',
    outputDir: 'test/results',
    storyDir: 'test/stories'
};

/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class SpectReporter extends Base {
    constructor(runner, options) {
        const opts = options.reporterOptions || {};
        let storyPath, outputPath, outputFilename;

        // Handle options and setup defaults
        opts.screenshotDir = opts.screenshotDir || defaults.screenshotDir;
        opts.outputDir = opts.outputDir || defaults.outputDir;
        opts.storyDir = opts.storyDir || defaults.storyDir;

        let curSuite = null;

        // Handle console output if requested, pass through to Spec reporter.
        if (opts.console) {
            Spec.call(this, runner);
        } else {
            Base.call(this, runner);
            //runner.on('end', this.epilogue.bind(this));
        }

        // Take screenshots of failed tests if requested
        if (opts.screenshot) {
            runner.on('fail', test => {
                screenshot(test, opts.screenshotDir);
            });
        }

        // Find the path for the output file, accomodate multi-suite sets.
        storyPath = runner.suite.file || (runner.suite.suites[0] && runner.suite.suites[0].file);

        // If there's no file, we can't continue.
        if(!storyPath) {
            return true;
        }

        [outputPath, outputFilename] = splitPath(storyPath, opts.storyDir, opts.outputDir);

        // Handle JSON output

        runner.on('suite', suite => {
            // In the case of protractor, skip the blank titled root suite.
            if (suite.title === '' && suite.suites.length === 1) {
                return false;
            }
            curSuite = new Suite(suite, curSuite);
            curSuite.start();
        });

        runner.on('suite end', () => {
            curSuite.stop();

            if (curSuite.parent) {
                let parent = curSuite.parent;
                parent.addSuite(curSuite);
                curSuite = parent;
            }
        });

        runner.on('pending', test => {
            curSuite.addTest(new Test(test, Test.TEST_PENDING));
        });

        runner.on('pass', test => {
            curSuite.addTest(new Test(test, Test.TEST_PASS));
        });

        runner.on('fail', (test, err) => {
            curSuite.addTest(new Test(test, Test.TEST_FAIL, err));
        });

        runner.on('end', () => {
            if(curSuite && curSuite.hasTests()) {
                curSuite.stop(); // End the current suite again.

                let jsonFilename = outputFilename.replace('.js', '.json');
                fs.outputJsonSync(outputPath + '/' + jsonFilename, curSuite);
            }
        });
    }
}

export default SpectReporter;
