import moment from "moment";

import { formatDate, LiveDateProvider, StaticDateProvider } from "src/utils/dates";

describe("Format date", () => {
    test("Different input overloads", () => {
        expect(formatDate(new Date(2023, 0, 1))).toBe("2023-01-01");
        expect(formatDate(2023, 1, 1)).toBe("2023-01-01");
        expect(formatDate(1672531200000)).toBe("2023-01-01");
    });

    test("handles a leap year date", () => {
        expect(formatDate(2020, 2, 29)).toBe("2020-02-29");
    });
});

describe("LiveDateProvider with Fake Timers", () => {
    let dateProvider: LiveDateProvider;

    beforeEach(() => {
        jest.useFakeTimers();
        const fakeDate = new Date("2023-01-01T12:00:00.000Z");
        jest.setSystemTime(fakeDate);
        dateProvider = new LiveDateProvider();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("now should return the mocked current moment", () => {
        const now = dateProvider.now;

        // Check if 'now' returns the mocked time
        expect(now.isSame(new Date("2023-01-01T12:00:00.000Z"))).toBe(true);
    });
});

describe("StaticDateProvider with Fake Timers", () => {
    let dateProvider: StaticDateProvider;

    beforeEach(() => {
        jest.useFakeTimers();
        const fakeDate = new Date("2023-01-01T12:00:00.000Z");
        jest.setSystemTime(fakeDate);
        dateProvider = new StaticDateProvider(moment());
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("now should return the mocked current moment", () => {
        const now = dateProvider.now;

        // Check if 'now' returns the mocked time
        expect(now.isSame(new Date("2023-01-01T12:00:00.000Z"))).toBe(true);
    });
});
