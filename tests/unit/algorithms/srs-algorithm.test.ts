import { SrsAlgorithm } from "src/algorithms/base/srs-algorithm";

describe("SrsAlgorithm not initialised exception", () => {
    beforeEach(() => {
        // Reset the singleton instance before each test
        SrsAlgorithm.instance = null;
    });

    test("getInstance() not initialised exception", () => {
        const t = () => {
            SrsAlgorithm.getInstance();
        };
        expect(t).toThrow(Error);
    });
});
