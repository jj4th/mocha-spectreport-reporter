const path = require('path');
import Test from 'spectreport';

describe('Spectreport Reporter', () => {
    let Spectreport, specReporterSpy, baseReporterSpy, outputJsonSync,
        splitPath, screenshot, options, spec, runner, runnerAlt;

    before(() => {
        options = {};

        splitPath = sinon.stub().returns([
            f.spec.outputPath,
            f.spec.outputFilename
        ]);

        screenshot = sinon.spy();
        outputJsonSync = sinon.spy();
        baseReporterSpy = sinon.spy();
        specReporterSpy = sinon.spy();

        // Rewire stub dependencies
        Spectreport = proxyquire(path.join(__dirname, '../src/index'), {
            'fs-extra': {'outputJsonSync': outputJsonSync},
            './util': {'splitPath': splitPath, 'screenshot': screenshot},
            'mocha': {'reporters': {'Spec': specReporterSpy, 'Base': baseReporterSpy}}
        });
    });

    describe('Base Reporter', () => {
        let results;

        before((done) => {
            runner = f.mochaFixtures().runner;
            spec = new Spectreport(runner, {});
            runner.run(() => {
                results = outputJsonSync.args[0][1];
                done();
            });
        });

        it('should properly initialize Spectreport', () => {
            expect(spec).to.not.be.null;
        });

        it('should not invoke the Spec reporter', () => {
            expect(specReporterSpy).to.have.been.not.called;
        });

        it('should invoke the Base reporter', () => {
            expect(baseReporterSpy).to.have.been.calledOnce;
            expect(baseReporterSpy).to.have.been.calledWith(runner);
        });

        it('should not invoke the Screenshot reporter', () => {
            expect(screenshot).to.have.been.not.called;
        });

        it('should output to the expected file path', () => {
            expect(splitPath).to.have.been.calledOnce;
            expect(splitPath).to.have.been.calledWith(f.spec.path,
                f.spec.storyDir, f.spec.outputDir);
            expect(outputJsonSync).to.have.been.calledOnce;
            expect(outputJsonSync).to.have.been.calledWith(f.spec.outputJSON);
        });

        it('should have the correct root suite', () => {
            expect(results).to.have.property('title', f.suite.title);
        });

        it('should have the correct root suite stats', () => {
            expect(results).to.have.property('stats')
                .to.have.property('tests', 3);
            expect(results).to.have.property('stats')
                .to.have.property('pending', 1);
            expect(results).to.have.property('stats')
                .to.have.property('failures', 1);
            expect(results).to.have.property('stats')
                .to.have.property('duration').within(0.1, 0.2);
        });

        it('should have two child suites', () => {
            expect(results).to.have.property('suites').to.have.length(2);
        });

        it('should have the correct first child suite stats', () => {
            let firstChild = results.suites[0];

            expect(firstChild).to.have.property('stats')
                .to.have.property('tests', 2);
            expect(firstChild).to.have.property('stats')
                .to.have.property('pending', 1);
            expect(firstChild).to.have.property('stats')
                .to.have.property('failures', 0);
            expect(firstChild).to.have.property('stats')
                .to.have.property('duration').within(0.06, 0.08);
        });

        it('should have the correct second child suite stats', () => {
            let secondChild = results.suites[1];

            expect(secondChild).to.have.property('stats')
                .to.have.property('tests', 1);
            expect(secondChild).to.have.property('stats')
                .to.have.property('pending', 0);
            expect(secondChild).to.have.property('stats')
                .to.have.property('failures', 1);
            expect(secondChild).to.have.property('stats')
                .to.have.property('duration').within(0.03, 0.10);
        });

        it('should have one passed test in the first suite', () => {
            let testPass = results.suites[0].tests[0];
            expect(testPass).to.have.property('title', f.testPass.title);
            expect(testPass).to.have.property('duration').within(0.06, 0.07);
            expect(testPass).to.have.property('status', Test.TEST_PASS);
        });

        it('should have one pending test in the first suite', () => {
            let testPending = results.suites[0].tests[1];
            expect(testPending).to.have.property('title', f.testPending.title);
            expect(testPending).to.have.property('status', Test.TEST_PENDING);
        });

        it('should have one failed test in the second suite', () => {
            let testFail = results.suites[1].tests[0];
            expect(testFail).to.have.property('title', f.testFail.title);
            expect(testFail).to.have.property('duration').within(0.03, 0.04);
            expect(testFail).to.have.property('status', Test.TEST_FAIL);
            expect(testFail).to.have.property('error')
                .to.have.property('message', 'There was an error');
            expect(testFail).to.have.property('error')
                .to.have.property('stack').to.contain('Error: There was an error');
        });
    });

    describe('Protractor Multi-suite', () => {
        let results;

        before((done) => {
            outputJsonSync.reset();
            splitPath.reset();

            runner = f.protractorFixtures().runner;
            spec = new Spectreport(runner, {});
            runner.run(() => {
                results = outputJsonSync.args[0][1];
                done();
            });
        });

        it('should output to the expected file path', () => {
            expect(splitPath).to.have.been.calledOnce;
            expect(splitPath).to.have.been.calledWith(f.spec.path,
                f.spec.storyDir, f.spec.outputDir);
            expect(outputJsonSync).to.have.been.calledOnce;
            expect(outputJsonSync).to.have.been.calledWith(f.spec.outputJSON);
        });

        it('should have the correct root suite', () => {
            expect(results).to.have.property('title', f.suite.title);
        });

        it('should have the correct root suite stats', () => {
            expect(results).to.have.property('stats')
                .to.have.property('tests', 3);
            expect(results).to.have.property('stats')
                .to.have.property('pending', 1);
            expect(results).to.have.property('stats')
                .to.have.property('failures', 1);
            expect(results).to.have.property('stats')
                .to.have.property('duration').within(0.1, 0.2);
        });

        it('should have two child suites', () => {
            expect(results).to.have.property('suites').to.have.length(2);
        });

        it('should have the correct first child suite stats', () => {
            let firstChild = results.suites[0];

            expect(firstChild).to.have.property('stats')
                .to.have.property('tests', 2);
            expect(firstChild).to.have.property('stats')
                .to.have.property('pending', 1);
            expect(firstChild).to.have.property('stats')
                .to.have.property('failures', 0);
            expect(firstChild).to.have.property('stats')
                .to.have.property('duration').within(0.06, 0.08);
        });

        it('should have the correct second child suite stats', () => {
            let secondChild = results.suites[1];

            expect(secondChild).to.have.property('stats')
                .to.have.property('tests', 1);
            expect(secondChild).to.have.property('stats')
                .to.have.property('pending', 0);
            expect(secondChild).to.have.property('stats')
                .to.have.property('failures', 1);
            expect(secondChild).to.have.property('stats')
                .to.have.property('duration').within(0.03, 0.05);
        });

        it('should have one passed test in the first suite', () => {
            let testPass = results.suites[0].tests[0];
            expect(testPass).to.have.property('title', f.testPass.title);
            expect(testPass).to.have.property('duration').within(0.06, 0.07);
            expect(testPass).to.have.property('status', Test.TEST_PASS);
        });

        it('should have one pending test in the first suite', () => {
            let testPending = results.suites[0].tests[1];
            expect(testPending).to.have.property('title', f.testPending.title);
            expect(testPending).to.have.property('status', Test.TEST_PENDING);
        });

        it('should have one failed test in the second suite', () => {
            let testFail = results.suites[1].tests[0];
            expect(testFail).to.have.property('title', f.testFail.title);
            expect(testFail).to.have.property('duration').within(0.03, 0.04);
            expect(testFail).to.have.property('status', Test.TEST_FAIL);
            expect(testFail).to.have.property('error')
                .to.have.property('message', 'There was an error');
            expect(testFail).to.have.property('error')
                .to.have.property('stack').to.contain('Error: There was an error');
        });
    });

    describe('Blank Suite', () => {
        before((done) => {
            outputJsonSync.reset();
            splitPath.reset();

            runner = f.blankFixture().runner;
            spec = new Spectreport(runner, {});
            runner.run(() => {
                done();
            });
        });

        it('should not try to write json', () => {
            expect(outputJsonSync).to.have.not.been.called;
        });
    });

    describe('Emtpy JS File', () => {
        before((done) => {
            outputJsonSync.reset();
            splitPath.reset();

            runner = f.emptyFixture().runner;
            spec = new Spectreport(runner, {});
            runner.run(() => {
                done();
            });
        });

        it('should not call splitPath', () => {
            expect(splitPath).to.have.not.been.called;
        });

        it('should not try to write json', () => {
            expect(outputJsonSync).to.have.not.been.called;
        });
    });

    describe('Console enabled', () => {
        before((done) => {
            options.console = true;

            runner = f.mochaFixtures().runner;
            spec = new Spectreport(runner, {
                reporterOptions: options
            });
            runner.run(() => {
                done();
            });
        });

        it('should invoke the Spec reporter', () => {
            expect(specReporterSpy).to.have.been.calledOnce;
            expect(specReporterSpy).to.have.been.calledWith(runner);
        });

    });

    describe('Screenshots enabled', () => {
        let mocha;

        before((done) => {
            options = {
                screenshot: true
            };

            mocha = f.mochaFixtures();
            runner = mocha.runner;
            spec = new Spectreport(runner, {
                reporterOptions: options
            });
            runner.run(() => {
                done();
            });
        });

        it('should invoke the Screenshot reporter', () => {
            let args = screenshot.args[0];

            expect(screenshot).to.have.been.calledOnce;
            expect(args[0]).to.include(mocha.testFail);
            expect(args[1]).to.equal(f.screenshot.dir);
        });

    });

    describe('Custom Options', () => {
        before((done) => {
            outputJsonSync.reset();
            splitPath.reset();
            splitPath.returns([
                f.spec.outputPathAlt,
                f.spec.outputFilenameAlt
            ]);
            screenshot.reset();

            options = {
                outputDir: f.spec.outputDirAlt,
                storyDir: f.spec.storyDirAlt,
                screenshot: true,
                screenshotDir: f.screenshot.dirAlt
            };

            runnerAlt = f.mochaFixtures(f.spec.pathAlt).runner;
            spec = new Spectreport(runnerAlt, {
                reporterOptions: options
            });
            runnerAlt.run(() => {
                done();
            });
        });

        it('should output to a different file path', () => {
            expect(splitPath).to.have.been.calledOnce;
            expect(splitPath).to.have.been.calledWith(f.spec.pathAlt,
                f.spec.storyDirAlt, f.spec.outputDirAlt);
            expect(outputJsonSync).to.have.been.calledOnce;
            expect(outputJsonSync).to.have.been.calledWith(f.spec.outputJSONAlt);
        });

        it('should screenshot to a different file path', () => {
            let args = screenshot.args[0];

            expect(screenshot).to.have.been.calledOnce;
            expect(args[1]).to.equal(f.screenshot.dirAlt);
        });
    });
});
