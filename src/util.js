const fs = require('fs-extra');

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
        let stream = fs.createWriteStream(screenshotPath);

        stream.write(new Buffer(png, 'base64'));
        stream.end();
    });

    return screenshotPath;
}

/**
 * Starting from haystack in the path, clear everything up to and including
 * the search string, then prepend the replace string, and return a path and
 * a filename
 *
 * @param "String" haystack
 * @param "String" search
 * @param "String" replace
 * @return "String","String" relativePath, filename
 * @api private
 */

export function splitPath(haystack, search, replace) {
    let relative = replace + haystack.split(search)[1];
    let tokens = relative.split('/');
    let filename = tokens.pop();
    let path = tokens.join('/');

    return [path, filename];
}
