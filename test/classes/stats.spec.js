import Stats from '../../src/classes/stats';

describe('Stats class', () => {

    describe('initialize', () => {
        it('should properly initialize a stat object', () => {
            let stats1 = new Stats(15, 3, 5, 11);

            expect(stats1).to.have.property('tests', 15);
            expect(stats1).to.have.property('pending', 3);
            expect(stats1).to.have.property('failures', 5);
            expect(stats1).to.have.property('duration', 11);
        });

        it('should properly initialize a stat object with defaults', () => {
            let stats1 = new Stats();

            expect(stats1).to.have.property('tests', 0);
            expect(stats1).to.have.property('pending', 0);
            expect(stats1).to.have.property('failures', 0);
            expect(stats1).to.have.property('duration', 0);
        });
    });

    describe('add', () => {
        it('should properly add two stat objects', () => {
            let stats1 = new Stats(15, 3, 4);
            let stats2 = new Stats(20, 5, 10);

            stats1.add(stats2);

            expect(stats1).to.have.property('tests', 35);
            expect(stats1).to.have.property('pending', 8);
            expect(stats1).to.have.property('failures', 14);
        });
    });
});
