class Stats {
    constructor(tests = 0, pending = 0, failures = 0, duration = 0) {
        this.tests = tests;
        this.pending = pending;
        this.failures = failures;
        this.duration = duration;
        this.timeStart = null;
        this.timeStop = null;
    }
    add(stats) {
        this.tests += stats.tests;
        this.pending += stats.pending;
        this.failures += stats.failures;
    }
}

export default Stats;
