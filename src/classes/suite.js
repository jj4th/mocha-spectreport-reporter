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
        return (this.stats.tests > 0);
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
        // Generate a clean, shallow copy without the parent
        var copy = {};

        for (let key of Object.keys(this)) {
            copy[key] = this[key];
        }
        copy.parent = undefined;

        return copy;
    }
}

export default Suite;
