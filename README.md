[![Build Status](https://travis-ci.org/jj4th/mocha-spectreport-reporter.svg?branch=master)](https://travis-ci.org/jj4th/mocha-spectreport-reporter) [![Coverage Status](https://coveralls.io/repos/github/jj4th/mocha-spectreport-reporter/badge.svg?branch=master)](https://coveralls.io/github/jj4th/mocha-spectreport-reporter?branch=master)

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
$ mocha --reporter mocha-better-spec-reporter ... # and other options there
$ mocha -R mocha-better-spec-reporter --reporter-options console=true,screenshots=true,...
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

## Options
This reporter supports a few options to customize your usage:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| console | Boolean | **False** | If set to **True**, will use the Mocha Spec reporter to output results to the console |
| outputDir | String | **"test/results"** | The directory where the reporter will dump its output |
| storyDir | String | **"test/stories"** | Where the reporter will expect to find your stories, used to represent the directory heirarchy in the results |
| screenshot | Boolean | **False** | If being used with Protractor, this will enable browser screenshots on failed tests |
| screenshotDir | String | **"test/screenshots"** | The directory where screenshots will be stored if **True** |
