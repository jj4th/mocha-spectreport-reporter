import Stats from '../../src/classes/stats';
import Suite from '../../src/classes/suite';
import Test from '../../src/classes/test';

describe('Suite class', () => {
    let suiteTest;

    beforeEach(() => {
        suiteTest = new Suite(f.suite, f.suiteParent);
    });

    describe('initialize', () => {
        it('should properly initialize a suite object', () => {
            expect(suiteTest).to.have.property('title', f.suite.title);
            expect(suiteTest).to.have.property('suites').to.be.a('array');
            expect(suiteTest).to.have.property('tests').to.be.a('array');
            expect(suiteTest).to.have.property('parent', f.suiteParent);
            expect(suiteTest).to.have.property('stats').to.be.an.instanceOf(Stats);
        });
    });

    describe('addStats', () => {
        it('should properly add a stats object', () => {
            let addStats = stub(suiteTest.stats, 'add');

            suiteTest.addStats(f.stats);
            expect(addStats).have.been.calledOnce;
            expect(addStats).have.been.calledWith(f.stats);
        });
    });

    describe('addSuite', () => {
        it('should properly add a suite with tests', () => {
            let hasTests = stub(f.suiteChild, 'hasTests', () => { return true; });

            suiteTest.addSuite(f.suiteChild);

            expect(hasTests).have.been.calledOnce;
            expect(suiteTest).to.have.property('suites').to.have.length(1);
            expect(suiteTest).to.have.property('suites').to.contain(f.suiteChild);
            hasTests.restore();
        });

        it('should properly not add a suite without tests', () => {
            let hasTests = stub(f.suiteChild, 'hasTests', () => { return false; });

            suiteTest.addSuite(f.suiteChild);

            expect(hasTests).have.been.calledOnce;
            expect(suiteTest).to.have.property('suites').to.be.empty;
            hasTests.restore();
        });
    });

    describe('addTest', () => {
        it('should properly add a test', () => {
            suiteTest.addTest(f.testPass);

            expect(suiteTest).to.have.property('tests').to.have.length(1);
            expect(suiteTest).to.have.property('tests').to.contain(f.testPass);
            expect(suiteTest).to.have.property('stats').to.have.property('tests', 1);
            expect(suiteTest).to.have.property('stats').to.have.property('pending', 0);
            expect(suiteTest).to.have.property('stats').to.have.property('failures', 0);
        });

        it('should properly add a pending test', () => {
            suiteTest.addTest(f.testPending);

            expect(suiteTest).to.have.property('tests').to.have.length(1);
            expect(suiteTest).to.have.property('tests').to.contain(f.testPending);
            expect(suiteTest).to.have.property('stats').to.have.property('tests', 1);
            expect(suiteTest).to.have.property('stats').to.have.property('pending', 1);
            expect(suiteTest).to.have.property('stats').to.have.property('failures', 0);

        });

        it('should properly add a failed test', () => {
            suiteTest.addTest(f.testFail);

            expect(suiteTest).to.have.property('tests').to.have.length(1);
            expect(suiteTest).to.have.property('tests').to.contain(f.testFail);
            expect(suiteTest).to.have.property('stats').to.have.property('tests', 1);
            expect(suiteTest).to.have.property('stats').to.have.property('pending', 0);
            expect(suiteTest).to.have.property('stats').to.have.property('failures', 1);
        });
    });

    describe('hasTests', () => {
        it('should return false when it does not have tests', () => {
            expect(suiteTest.hasTests()).to.be.false;
        });

        it('should return true when it does have tests', () => {
            suiteTest.stats.tests = 1;
            expect(suiteTest.hasTests()).to.be.true;
        });
    });

    describe('start/stop', () => {
        it('should properly set the start time', () => {
            let lower = Date.now();
            suiteTest.start();
            let upper = Date.now();

            expect(suiteTest).to.have.property('stats')
                .to.have.property('timeStart')
                .to.be.within(lower, upper);
        });

        it('should properly set the stop time and duration', (done) => {
            let lower = Date.now();
            suiteTest.stats.timeStart = Date.now();

            setTimeout(() => {
                suiteTest.stop();
                let upper = Date.now();
                let duration = Math.round((upper - lower) / 10) / 100;

                expect(suiteTest).to.have.property('stats')
                    .to.have.property('timeStop')
                    .to.be.within(lower, upper);
                expect(suiteTest).to.have.property('stats')
                    .to.have.property('duration')
                    .to.be.within(0, duration);
                done();
            }, 10);
        });

        it('should silently fail if stop is called before start', () => {
            suiteTest.stop();

            expect(suiteTest).to.have.property('stats')
                .to.have.property('timeStop').to.be.null;
            expect(suiteTest).to.have.property('stats')
                .to.have.property('duration').to.be.equal(0);
        });
    });

    describe('toJSON', () => {
        it('should generate JSON of the suite without its parent.', () =>{
            let jsonTest = JSON.stringify(suiteTest);

            // We don't need to test that JSON.stringify works, we just need
            // to make sure that the parent key is successfully removed
            expect(jsonTest).to.not.contain('parent');
        });
    });
});
