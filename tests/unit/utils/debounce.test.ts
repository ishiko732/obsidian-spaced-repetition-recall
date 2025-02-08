import { applySettingsUpdate } from "src/utils/debounce";

jest.useFakeTimers();

describe("applySettingsUpdate", () => {
    it("should call the callback after the debounce time", () => {
        const callback = jest.fn();
        applySettingsUpdate(callback);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(512);

        expect(callback).toBeCalled();
    });

    it("should reset the timer if called again before the debounce time", () => {
        const callback = jest.fn();
        applySettingsUpdate(callback);
        applySettingsUpdate(callback);

        jest.advanceTimersByTime(511);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(1);

        expect(callback).toBeCalled();
    });
});
