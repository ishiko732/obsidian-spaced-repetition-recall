import { DataStore } from "src/data-stores/base/data-store";

describe("DataStore not initialised exception", () => {
    beforeEach(() => {
        // Reset the singleton instance before each test
        DataStore.instance = null;
    });

    test("getInstance() not initialised exception", () => {
        const t = () => {
            DataStore.getInstance();
        };
        expect(t).toThrow(Error);
    });
});
