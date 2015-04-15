import Test from '../../src/classes/test';

describe('Test class', () => {
    let passTest, failTest, fullTitle;

    beforeEach(() => {
        fullTitle = spy(f.testPass, 'fullTitle');
    });

    describe('initialize', () => {
        it('should properly initialize a test object', () => {
            passTest = new Test(f.testPass, Test.TEST_PASS);
            expect(fullTitle).to.have.been.calledOnce;
            expect(passTest).to.have.property('title', f.testPass.title);
            expect(passTest).to.have.property('fullTitle', f.testPass.fullTitle());
            expect(passTest).to.have.property('duration', 0.01);
            expect(passTest).to.have.property('error').to.be.null;
        });

        it('should properly initalize a test object with error', () => {
            failTest = new Test(f.testFail, Test.TEST_FAIL, f.testFailError);

            expect(failTest).to.have.property('error').to.deep.equal(f.testFailError);
        });
    });
});
