const fs = require('fs-extra');
const path = require('path');

/**
 * Takes a screenshot of a failed test and returns the relative path
 * to that screenshot.  Note that this expects a browser object for protractor
 * and naively assumes that the screenshots directory exists.
 *
 * @param {Object} test
 * @return "String" screenshotPath
 * @api private
 */

export function screenshot(test, dir) {
    let filename = (test.parent.title + ' ' + test.title).replace(/\W+/g, '_') + '.png';
    let screenshotPath = `${dir}/${filename}`;

    /*global browser*/
    browser.takeScreenshot().then(png => {
        fs.outputFile(screenshotPath, new Buffer(png, 'base64'));
    });

    return screenshotPath;
}

/**
 * For filePath underneath the srcPath directory
 *   replace srcPath with destPath and return both the
 *   new folder path, and the basename.
 *
 * @param "String" filePath
 * @param "String" srcPath
 * @param "String" destPath
 * @return "String","String" relativePath, filename
 * @api private
 */

export function splitPath(filePath, srcPath, destPath) {
    var searchPath = path.resolve(srcPath);
    var relative = path.relative(searchPath, filePath);
    var fullPath = path.resolve(destPath, relative);

    return [path.dirname(fullPath), path.basename(fullPath)];
}

/**
 * For a suite which is missing a file field, recursively
 * propagate the field from it's child suites or tests.
 * This modifies the suite object in place.
 *
 * @param "Object" suite
 * @return "Object" suite
 * @api private
 */

export function fixFileField(suite) {
    for (let childSuite of suite.suites) {
        if (!childSuite.file) {
            fixFileField(childSuite);
        }
    }
    if (suite.tests[0] && suite.tests[0].file) {
        suite.file = suite.tests[0].file;
    } else if (suite.suites[0] && suite.suites[0].file) {
        suite.file = suite.suites[0].file;
    }

    return suite;
}
