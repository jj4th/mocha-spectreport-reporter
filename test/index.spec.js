const path = require('path');
import Test from '../src/classes/test';

describe('Spectreport Reporter', () => {
    let spectreport, specReporterSpy, streamStub,
        fsStub, utilStub, options, runner, runnerAlt;

    before(() => {
        options = {};
        streamStub = {
            write: sinon.spy(),
            end: sinon.spy()
        };

        fsStub = {
            createWriteStream: sinon.stub().returns(streamStub)
        };

        utilStub = {
            splitPath: sinon.stub().returns([
                f.spec.outputPath,
                f.spec.outputFilename
            ]),
            screenshot: sinon.spy()
        };

        specReporterSpy = sinon.spy();

        // Rewire stub dependencies
        spectreport = proxyquire(path.join(__dirname, '../src/index'), {
            'fs-extra': fsStub,
            './util': utilStub,
            'mocha': {'reporters': {'Spec': specReporterSpy}}
        });
    });

    describe('Base Reporter', () => {
        let json, results;

        before((done) => {
            runner = f.mochaFixtures().runner;
            spectreport(runner, {});
            runner.run(() => {
                json = streamStub.write.args[0][0];
                results = JSON.parse(json);
                done();
            });
        });

        it('should not invoke the Spec reporter', () => {
            expect(specReporterSpy).to.have.been.not.called;
        });

        it('should not invoke the Screenshot reporter', () => {
            expect(specReporterSpy).to.have.been.not.called;
        });

        it('should output to the expected file path', () => {
            expect(utilStub.splitPath).to.have.been.calledOnce;
            expect(utilStub.splitPath).to.have.been.calledWith(f.spec.path,
                f.spec.storyDir, f.spec.outputDir);
            expect(fsStub.createWriteStream).to.have.been.calledOnce;
            expect(fsStub.createWriteStream).to.have.been.calledWith(f.spec.outputJSON);
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
            expect(testPass).to.have.property('duration', 0.06);
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
            expect(testFail).to.have.property('duration', 0.04);
            expect(testFail).to.have.property('status', Test.TEST_FAIL);
            expect(testFail).to.have.property('error')
                .to.have.property('message', 'There was an error');
            expect(testFail).to.have.property('error')
                .to.have.property('stack').to.contain('Error: There was an error');
        });
    });

    describe('Console enabled', () => {
        before((done) => {
            options.console = true;

            runner = f.mochaFixtures().runner;
            spectreport(runner, {
                reporterOptions: options
            });
            runner.run(() => {
                done();
            });
        });

        it('should invoke the Spec reporter', () => {
            expect(specReporterSpy).to.have.been.calledOnce;
            expect(specReporterSpy).to.have.been.calledWith(runner, {
                reporterOptions: options
            });
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
            spectreport(runner, {
                reporterOptions: options
            });
            runner.run(() => {
                done();
            });
        });

        it('should invoke the Screenshot reporter', () => {
            let args = utilStub.screenshot.args[0];

            expect(utilStub.screenshot).to.have.been.calledOnce;
            expect(args[0]).to.include(mocha.testFail);
            expect(args[1]).to.equal(f.screenshot.dir);
        });

    });

    describe('Custom Options', () => {
        before((done) => {
            fsStub.createWriteStream.reset();
            utilStub.splitPath.reset();
            utilStub.splitPath.returns([
                f.spec.outputPathAlt,
                f.spec.outputFilenameAlt
            ]);
            utilStub.screenshot.reset();

            options = {
                outputDir: f.spec.outputDirAlt,
                storyDir: f.spec.storyDirAlt,
                screenshot: true,
                screenshotDir: f.screenshot.dirAlt
            };

            runnerAlt = f.mochaFixtures(f.spec.pathAlt).runner;
            spectreport(runnerAlt, {
                reporterOptions: options
            });
            runnerAlt.run(() => {
                done();
            });
        });

        it('should output to a different file path', () => {
            expect(utilStub.splitPath).to.have.been.calledOnce;
            expect(utilStub.splitPath).to.have.been.calledWith(f.spec.pathAlt,
                f.spec.storyDirAlt, f.spec.outputDirAlt);
            expect(fsStub.createWriteStream).to.have.been.calledOnce;
            expect(fsStub.createWriteStream).to.have.been.calledWith(f.spec.outputJSONAlt);
        });

        it('should screenshot to a different file path', () => {
            let args = utilStub.screenshot.args[0];

            expect(utilStub.screenshot).to.have.been.calledOnce;
            expect(args[1]).to.equal(f.screenshot.dirAlt);
        });
    });
});
