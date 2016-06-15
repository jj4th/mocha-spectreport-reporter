// We do not mock path here, for simplicity.  Assume nodejs 'path' works :D
const path = require('path');

describe('Utility Functions', () => {
    let browserStub, streamStub, fsStub, ss, util;

    before(() => {
        ss = f.screenshot;

        browserStub = {
            takeScreenshot: sinon.stub().resolves(ss.data)
        };
        streamStub = {
            write: sinon.spy(),
            end: sinon.spy()
        };
        fsStub = {
            createOutputStream: sinon.stub().returns(streamStub)
        };

        global.browser = browserStub;

        // Rewire stub dependencies
        util = proxyquire(path.join(__dirname, '../src/util'), {
           'fs-extra': fsStub
        });
    });

    describe('screenshot', () => {
        let pathScreenshot;

        before(() => {
            pathScreenshot = util.screenshot(ss.test, ss.dir);
        });

        it('should take the screenshot', () => {
            expect(browserStub.takeScreenshot).to.have.been.calledOnce;
        });

        it('should write the file to disk', () => {
            let dataArg = String(streamStub.write.args[0][0]);

            expect(fsStub.createOutputStream).to.have.been.calledOnce;
            expect(fsStub.createOutputStream).to.have.been.calledWith(ss.path);
            expect(streamStub.write).to.have.been.calledOnce;
            expect(dataArg).to.be.eql(ss.base64);
        });

        it('should return the expected path', () => {
            expect(pathScreenshot).to.be.equal(ss.path);
        });
    });

    describe('splitPath', () => {
        let outputPath, filename, spec;

        before(() => {
            spec = f.spec;
            [outputPath, filename] = util.splitPath(spec.path, spec.storyDir, spec.outputDir);
        });

        it('should return the expected path', () => {
            expect(outputPath).to.be.equal(path.resolve(spec.outputPath));
        });

        it('should return the expected filename', () => {
            expect(filename).to.be.equal(spec.outputFilename);
        });
    });

    describe('fixFileField', () => {
        let obj, suite;

        it('should set the file field on the suite from child suite', () => {
            obj = f.pendingFixturesSuite();
            suite = util.fixFileField(obj.suite);
            expect(suite.file).to.be.equal(f.spec.pathPending);
        });

        it('should set the file field on the suite from child test', () => {
            obj = f.pendingFixturesTest();
            suite = util.fixFileField(obj.suite);
            expect(suite.file).to.be.equal(f.spec.pathPending);
        });

        it('should set the file field on the suite from child suite test', () => {
            obj = f.pendingFixturesChildTest();
            suite = util.fixFileField(obj.suite);
            expect(suite.file).to.be.equal(f.spec.pathPending);
        });

        it('should not throw an exception if no file is able to be propagated', () => {
            obj = f.pendingFixturesNoFile();
            suite = util.fixFileField(obj.suite);
            expect(suite.file).to.be.undefined;
        });
    });
});
