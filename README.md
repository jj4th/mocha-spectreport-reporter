[![Build Status](https://travis-ci.org/jj4th/mocha-spectreport-reporter.svg?branch=master)](https://travis-ci.org/jj4th/mocha-spectreport-reporter) [![Coverage Status](https://coveralls.io/repos/github/jj4th/mocha-spectreport-reporter/badge.svg?branch=master)](https://coveralls.io/github/jj4th/mocha-spectreport-reporter?branch=master) [![devDependency Status](https://david-dm.org/jj4th/mocha-spectreport-reporter/dev-status.svg)](https://david-dm.org/jj4th/mocha-spectreport-reporter#info=devDependencies)

# mocha-spectreport-reporter
A mocha reporter for use with Spectreport.  This reporter generates .json test results from a mocha test run in a format understood by the Spectreport HTML report generator.  It also has support for console logging (provided by the mocha generic Spec reporter).

## Special note for Protractor
If you're testing an Angular web application in Selenium via the Protractor framework, you can enable screenshots.  This feature was added as a convenience for the author, and is disabled by default.

## Installation & Usage
The recommended installation method is NPM:

```shell
$ npm install mocha-spectreport-reporter --save-dev
```

You will need to tell mocha to use the reporter:
```shell
$ mocha --reporter mocha-spectreport-reporter ... # and other options there
$ mocha -R mocha-spectreport-reporter --reporter-options console=true,screenshots=true,...
```

If you are using protractor, add the reporter to the `mochaOpts` section of your protractor configuration file.
```javascript
mochaOpts: {
    reporter: require('mocha-spectreport-reporter'),
    reporterOptions: {
        console: true,
        screenshot: true
    },
    ui: 'bdd'
}
```

## Special Note on syntax errors in test files.
Mocha does not currently trap exceptions that occur upon requiring a test file.  This means that if you have you have a syntax error, reference error, dependency error, etc... in one of your test files outside of a test function block, mocha will never read the file, and this reporter will have no knowledge of that fact.  This is especially relevant projects that use some sort of sharding mechanism, like protractor running with multiple instances of selenium, or against a selenium grid.

As a workaround, there is a contrib script included with this module at: `contrib/mocha-loadFiles-patch.js`.  This script monkey patches `Module._load` and `Mocha.prototype.loadFiles`, so it is included only as a workaround.

If you are using a custom interface that does not use `Mocha.prototype.loadFiles` this patch will not work.

Simply require this file at some point before running any of your tests, and it will alter mocha to generate failed tests instead of throwing errors.  This solution is known to work with Mocha 2.0 and above.

```shell
$ mocha -r 'mocha-spectreport-reporter/contrib/mocha-loadFiles-patch'
```

If you are using protractor, just require the file at the top of your protractor configuration file.

```javascript
require('mocha-spectreport-reporter/contrib/mocha-loadFiles-patch');
exports.config = { ... }
```

## Options
This reporter supports a few options to customize your usage:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| console | Boolean | **False** | If set to **True**, will use the Mocha Spec reporter to output results to the console |
| outputDir | String | **"test/results"** | The directory where the reporter will dump its output |
| storyDir | String | **"test/stories"** | Where the reporter will expect to find your stories, used to represent the directory heirarchy in the results |
| screenshot | Boolean | **False** | If being used with Protractor, this will enable browser screenshots on failed tests |
| screenshotDir | String | **"test/screenshots"** | The directory where screenshots will be stored if **True** |


Oh don't merge this.
