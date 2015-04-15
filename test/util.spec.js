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
            createWriteStream: sinon.stub().returns(streamStub)
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

            expect(fsStub.createWriteStream).to.have.been.calledOnce;
            expect(fsStub.createWriteStream).to.have.been.calledWith(ss.path);
            expect(streamStub.write).to.have.been.calledOnce;
            expect(dataArg).to.be.eql(ss.base64);
        });

        it('should return the expected path', () => {
            expect(pathScreenshot).to.be.equal(ss.path);
        });
    });

    describe('splitPath', () => {
        let path, filename, spec;

        before(() => {
            spec = f.spec;
            [path, filename] = util.splitPath(spec.path, spec.storyDir, spec.outputDir);
        });

        it('should return the expected path', () => {
            expect(path).to.be.equal(spec.outputPath);
        });

        it('should return the expected filename', () => {
            expect(filename).to.be.equal(spec.outputFilename);
        });
    });
});
