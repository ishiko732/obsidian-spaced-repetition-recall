import { DataStoreAlgorithm } from "src/data-store-algorithm/data-store-algorithm";

describe("DataStoreAlgorithm not initialised exception", () => {
    beforeEach(() => {
        // Reset the singleton instance before each test
        DataStoreAlgorithm.instance = null;
    });

    test("getInstance() not initialised exception", () => {
        const t = () => {
            DataStoreAlgorithm.getInstance();
        };
        expect(t).toThrow(Error);
    });
});
