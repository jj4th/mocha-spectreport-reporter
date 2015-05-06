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
        let stream = fs.createOuputStream(screenshotPath);

        stream.write(new Buffer(png, 'base64'));
        stream.end();
    });

    return screenshotPath;
}

/**
 * For haystack underneath the search directory
 *
 * @param "String" haystack
 * @param "String" search
 * @param "String" replace
 * @return "String","String" relativePath, filename
 * @api private
 */

export function splitPath(haystack, search, replace) {
    var searchPath = path.resolve(search);
    var relative = path.relative(searchPath, haystack);
    var fullPath = path.resolve(replace, relative);

    return [path.dirname(fullPath), path.basename(fullPath)];
}
