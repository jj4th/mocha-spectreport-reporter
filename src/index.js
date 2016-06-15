const fs = require('fs-extra');

/**
 * Module dependencies.
 */
const mocha = require('mocha');
const Spec = mocha.reporters.Spec;
const Base = mocha.reporters.Base;

import {screenshot, splitPath, fixFileField} from './util';
import Spectreport from 'spectreport';
const Suite = Spectreport.Suite;
const Test = Spectreport.Test;

/**
 * Default values
 */
const defaults = {
    screenshotDir: 'test/screenshots',
    outputDir: 'test/results',
    storyDir: 'test/stories'
};

/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class SpectReporter {
    constructor(runner, options) {
        const opts = options.reporterOptions || {};
        let outputPath, outputFilename, curSuite = null;

        // Handle options and setup defaults
        opts.screenshotDir = opts.screenshotDir || defaults.screenshotDir;
        opts.outputDir = opts.outputDir || defaults.outputDir;
        opts.storyDir = opts.storyDir || defaults.storyDir;

        // Handle console output if requested, pass through to Spec reporter.
        if (opts.console) {
            this.reporter = new Spec(runner);
        // Otherwise, register the default hooks on suite/test events
        } else {
            this.reporter = new Base(runner);
        }

        // Take screenshots of failed tests if requested
        if (opts.screenshot) {
            runner.on('fail', test => {
                screenshot(test, opts.screenshotDir);
            });
        }

        runner.on('suite', suite => {
            // In the case of protractor, skip the blank titled root suite.
            if (suite.title === '' && suite.suites.length === 1) {
                return false;
            }

            // In the case of pending suites, fix the file attribute.
            if (suite.pending && !suite.file) {
                fixFileField(suite);
            }

            curSuite = new Suite(suite, curSuite);
            curSuite.start();
        });

        runner.on('suite end', () => {
            curSuite.stop();

            if(curSuite.file && (!curSuite.parent || curSuite.parent.file !== curSuite.file)) {
                [outputPath, outputFilename] = splitPath(curSuite.file, opts.storyDir, opts.outputDir);
                let jsonFilename = outputFilename.replace('.js', '.json');
                fs.outputJsonSync(outputPath + '/' + jsonFilename, curSuite);
            }

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
    }
}

export default SpectReporter;
