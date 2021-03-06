const Mocha = require('mocha'),
    Suite = Mocha.Suite,
    Runner = Mocha.Runner,
    Test = Mocha.Test;

// static fixtures
const fixtures = {
    stats: {
        tests: 10,
        failures: 5,
        pending: 2,
        duration: 15
    },
    suite: {
        title: 'Test Suite',
        stats: {},
        hasTests: () => { return true; }
    },
    suitePending: {
        title: 'Test Pending Suite',
        stats: {},
        hasTests: () => { return true; },
        pending: true
    },
    suiteParent: {
        title: 'Test Suite Parent',
        stats: {},
        hasTests: () => { return true; }
    },
    suiteChild: {
        title: 'Test Suite Child',
        stats: {},
        hasTests: () => { return true; }
    },
    suiteChildAlt: {
        title: 'Test Suite ChildAlt',
        stats: {},
        hasTests: () => { return true; }
    },
    testPass: {
        title: 'Test Pass',
        fullTitle() {
            return 'Test Suite Test Pass';
        },
        status: 1,
        duration: 10
    },
    testPending: {
        title: 'Test Pending',
        fullTitle() {
            return 'Test Suite Test Pending';
        },
        status: 2,
        duration: 10
    },
    testFail: {
        title: 'Test Failed',
        fullTitle() {
            return 'Test Suite Test Failed';
        },
        status: 0,
        duration: 10
    },
    testFailError: {
        message: 'There was an error',
        stack: 'Error: Line 1, colume 1'
    },
    screenshot: {
        test: {
            title: 'Test Screenshot',
            status: 0,
            parent: {
                title: 'Suite Screenshot'
            }
        },
        dir: 'test/screenshots',
        dirAlt: 'test/screens',
        path: 'test/screenshots/Suite_Screenshot_Test_Screenshot.png',
        pathAlt: 'test/screens/Suite_Screenshot_Test_Screenshot.png',
        data: 'c2NyZWVuc2hvdC5wbmc=',
        base64: 'screenshot.png'
    },
    spec: {
        path: 'test/stories/suite/test.spec.js',
        storyDir: 'test/stories',
        outputDir: 'test/results',
        outputFilename: 'test.spec.js',
        outputPath: 'test/results/suite',
        outputJSON: 'test/results/suite/test.spec.js.json',
        pathAlt: 'test/specs/suite/testAlt.spec.js',
        storyDirAlt: 'test/specs',
        outputDirAlt: 'test/output',
        outputFilenameAlt: 'testAlt.spec.js',
        outputPathAlt: 'test/output/suite',
        outputJSONAlt: 'test/output/suite/testAlt.spec.js.json',
        pathPending: 'test/stories/suite/testPending.spec.js',
        outputDirPending: 'test/results',
        outputFilenamePending: 'testPending.spec.js',
        outputPathPending: 'test/results/suite',
        outputJSONPending: 'test/results/suite/testPending.spec.js.json'
    },
    mochaFixtures(specPath) {
        var obj = {}
        obj.suite = new Suite(fixtures.suite.title, '');
        obj.suite.file = specPath || fixtures.spec.path;

        obj.suiteChild1 = new Suite(fixtures.suiteChild.title, obj.suite);
        obj.suiteChild2 = new Suite(fixtures.suiteChild.title, obj.suite);
        obj.suite.addSuite(obj.suiteChild1);
        obj.suite.addSuite(obj.suiteChild2);

        obj.testPass = new Test(fixtures.testPass.title, done => {
            setTimeout(() => {
                done();
            }, 62);
        });
        obj.testPending = new Test(fixtures.testPending.title);
        obj.testFail = new Test(fixtures.testFail.title, done => {
            setTimeout(() => {
                done(new Error(fixtures.testFailError.message));
            }, 38);
        });

        obj.suiteChild1.addTest(obj.testPass);
        obj.suiteChild1.addTest(obj.testPending);
        obj.suiteChild2.addTest(obj.testFail);

        obj.runner = new Runner(obj.suite);

        return obj;
    },
    protractorFixtures() {
        var obj = {};
        obj.root = new Suite('', '');
        obj.suite = new Suite(fixtures.suite.title, obj.root);
        obj.root.addSuite(obj.suite)

        obj.suiteChild1 = new Suite(fixtures.suiteChild.title, obj.suite);
        obj.suiteChild1.file = fixtures.spec.path;
        obj.suiteChild2 = new Suite(fixtures.suiteChildAlt.title, obj.suite);
        obj.suiteChild2.file = fixtures.spec.pathAlt;
        obj.suite.addSuite(obj.suiteChild1);
        obj.suite.addSuite(obj.suiteChild2);

        obj.testPass = new Test(fixtures.testPass.title, done => {
            setTimeout(() => {
                done();
            }, 62);
        });
        obj.testPending = new Test(fixtures.testPending.title);
        obj.testFail = new Test(fixtures.testFail.title, done => {
            setTimeout(() => {
                done(new Error(fixtures.testFailError.message));
            }, 38);
        });

        obj.suiteChild1.addTest(obj.testPass);
        obj.suiteChild1.addTest(obj.testPending);
        obj.suiteChild2.addTest(obj.testFail);

        obj.runner = new Runner(obj.root);

        return obj;
    },
    pendingFixturesSuite() {
        var obj = {};
        obj.root = new Suite('', '');
        obj.suite = new Suite(fixtures.suitePending.title, obj.root);
        obj.suite.pending = true;
        obj.root.addSuite(obj.suite)

        obj.suiteChild1 = new Suite(fixtures.suiteChild.title, obj.suite);
        obj.suiteChild1.file = fixtures.spec.pathPending;
        obj.suite.addSuite(obj.suiteChild1);

        obj.runner = new Runner(obj.root);

        return obj;
    },
    pendingFixturesTest() {
        var obj = {};
        obj.root = new Suite('', '');
        obj.suite = new Suite(fixtures.suitePending.title, obj.root);
        obj.suite.pending = true;
        obj.root.addSuite(obj.suite)

        obj.testPending = new Test(fixtures.testPending.title);
        obj.testPending.file = fixtures.spec.pathPending;
        obj.suite.addTest(obj.testPending);

        obj.runner = new Runner(obj.root);

        return obj;
    },
    pendingFixturesChildTest() {
        var obj = {};
        obj.root = new Suite('', '');
        obj.suite = new Suite(fixtures.suitePending.title, obj.root);
        obj.suite.pending = true;
        obj.root.addSuite(obj.suite)

        obj.suiteChild1 = new Suite(fixtures.suiteChild.title, obj.suite);
        obj.suite.addSuite(obj.suiteChild1);

        obj.testPending = new Test(fixtures.testPending.title);
        obj.testPending.file = fixtures.spec.pathPending;
        obj.suiteChild1.addTest(obj.testPending);

        obj.runner = new Runner(obj.root);

        return obj;
    },
    pendingFixturesNoFile() {
        var obj = {};
        obj.root = new Suite('', '');
        obj.suite = new Suite(fixtures.suitePending.title, obj.root);
        obj.suite.pending = true;
        obj.root.addSuite(obj.suite)

        obj.testPending = new Test(fixtures.testPending.title);
        obj.suite.addTest(obj.testPending);

        obj.runner = new Runner(obj.root);

        return obj;
    },
    blankFixture(specPath) {
        var obj = {};
        obj.root = new Suite('', '');
        obj.root.file = specPath || fixtures.spec.path;
        obj.runner = new Runner(obj.root);

        return obj;
    },
    emptyFixture() {
        var obj = {};
        obj.root = new Suite('', '');
        obj.runner = new Runner(obj.root);

        return obj;
    }
};

export default fixtures;
