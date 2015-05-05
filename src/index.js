const fs = require('fs-extra');

/**
 * Module dependencies.
 */
const specReporter = require('mocha').reporters.Spec;

import {screenshot, splitPath} from './util';
import Suite from './classes/suite';
import Test from './classes/test';

/**
 * Default values
 */
const defaults = {
    screenshotDir: 'test/screenshot',
    outputDir: 'test/output',
    storyDir: 'test/stories'
};

/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
function Spec(runner, options) {
    const opts = options.reporterOptions || {};

    // Handle options and setup defaults
    opts.screenshotDir = opts.screenshotDir || defaults.screenshotDir;
    opts.outputDir = opts.outputDir || defaults.outputDir;
    opts.storyDir = opts.storyDir || defaults.storyDir;

    let curSuite = null;

    const storyPath = runner.suite.file;

    const [outputPath, outputFilename] = splitPath(storyPath,
        opts.storyDir, opts.outputDir);

    // Handle console output if requested, pass through to Spec reporter.
    if (opts.console) {
        specReporter(runner, options);
    }

    // Take screenshots of failed tests if requested
    if (opts.screenshot) {
        runner.on('fail', test => {
            screenshot(test, opts.screenshotDir);
        });
    }

    // Handle JSON output

    runner.on('suite', suite => {
        curSuite = new Suite(suite, curSuite);
        curSuite.start();
    });

    runner.on('suite end', () => {
        curSuite.stop();

        if (curSuite.parent) {
            curSuite.parent.addSuite(curSuite);
            curSuite = curSuite.parent;
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
        curSuite.stop(); // End the current suite again.

        let jsonFilename = outputFilename.replace('.js', '.json');

        let stream = fs.createWriteStream(outputPath + '/' + jsonFilename);
        stream.write(JSON.stringify(curSuite, null, 2));
        stream.end();
    });
}

export default Spec;
