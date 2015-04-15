import Stats from './stats';
import Test from './test';

class Suite {
    constructor(suite, parent) {
        this.title = suite.title;
        this.suites = [];
        this.tests = [];
        this.parent = parent;
        this.stats = new Stats();
    }
    addStats(stats) {
        this.stats.add(stats);
    }
    addSuite(suite) {
        if (!suite.hasTests()) {
            return false;
        }
        this.suites.push(suite);
        this.addStats(suite.stats);
    }
    addTest(test) {
        this.tests.push(test);
        this.stats.tests++;

        if (test.status === Test.TEST_PENDING) {
            this.stats.pending++;
        }
        else if (test.status === Test.TEST_FAIL) {
            this.stats.failures++;
        }
    }
    hasTests() {
        return (this.tests.length > 0);
    }
    start () {
        this.stats.timeStart = Date.now();
    }
    stop () {
        if(!this.stats.timeStart > 0) {
            return false;
        }
        this.stats.timeStop = Date.now();
        this.stats.duration = Math.round((this.stats.timeStop - this.stats.timeStart) / 10) / 100;
    }
    toJSON() {
        var clone = Object.assign({}, this);
        clone.parent = undefined;
        return clone;
    }
}

export default Suite;
