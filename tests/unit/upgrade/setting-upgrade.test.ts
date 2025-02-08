import { IOsrParameters } from "src/algorithms/osr/types";
import { SRSettings, upgradeAlgorithmSettings, upgradeSettings } from "src/settings";

describe("upgradeSettings", () => {
    it("updates flashcardCardOrder/flashcardDeckOrder and clears randomizeCardOrder when applicable", () => {
        const settings: SRSettings = Object.assign({} as SRSettings, {
            randomizeCardOrder: true,
            flashcardCardOrder: null,
            flashcardDeckOrder: null,
            clozePatterns: [],
            convertHighlightsToClozes: false,
            convertBoldTextToClozes: false,
            convertCurlyBracketsToClozes: false,
        });

        upgradeSettings(settings);
        expect(settings.flashcardCardOrder).toBe("DueFirstRandom");
        expect(settings.flashcardDeckOrder).toBe("PrevDeckComplete_Sequential");
        expect(settings.randomizeCardOrder).toBeNull();
    });

    it("creates and populates clozePatterns if it is null", () => {
        const settings: SRSettings = Object.assign({} as SRSettings, {
            randomizeCardOrder: null,
            flashcardCardOrder: null,
            flashcardDeckOrder: null,
            clozePatterns: null,
            convertHighlightsToClozes: true,
            convertBoldTextToClozes: true,
            convertCurlyBracketsToClozes: true,
        });

        upgradeSettings(settings);
        expect(Array.isArray(settings.clozePatterns)).toBe(true);
        expect(settings.clozePatterns).toContain("==[123;;]answer[;;hint]==");
        expect(settings.clozePatterns).toContain("**[123;;]answer[;;hint]**");
        expect(settings.clozePatterns).toContain("{{[123;;]answer[;;hint]}}");
    });

    it("leaves clozePatterns alone if it already exists", () => {
        const settings: SRSettings = Object.assign({} as SRSettings, {
            randomizeCardOrder: null,
            flashcardCardOrder: null,
            flashcardDeckOrder: null,
            clozePatterns: ["myExistingPattern"],
            convertHighlightsToClozes: false,
            convertBoldTextToClozes: false,
            convertCurlyBracketsToClozes: false,
        });

        upgradeSettings(settings);
        expect(settings.clozePatterns).toEqual(["myExistingPattern"]);
    });
});

describe("upgradeAlgorithmSettings", () => {
    it("populates osrParams if it is null", () => {
        const settings: SRSettings = Object.assign({} as SRSettings, {
            osrParams: null,
            baseEase: 300,
            lapsesIntervalChange: 0.6,
            easyBonus: 1.4,
            loadBalance: false,
            maximumInterval: 36500,
            maxLinkFactor: 1.1,
        });

        upgradeAlgorithmSettings(settings);
        expect(settings.osrParams).toEqual({
            baseEase: 300,
            lapsesIntervalChange: 0.6,
            easyBonus: 1.4,
            loadBalance: false,
            maximumInterval: 36500,
            maxLinkFactor: 1.1,
        });
        const _settings = settings as unknown as Record<string, unknown>;
        expect(_settings.baseEase).toBeUndefined();
        expect(_settings.lapsesIntervalChange).toBeUndefined();
        expect(_settings.easyBonus).toBeUndefined();
        expect(_settings.loadBalance).toBeUndefined();
        expect(_settings.maximumInterval).toBeUndefined();
        expect(_settings.maxLinkFactor).toBeUndefined();
    });

    it("leaves osrParams alone if it already exists", () => {
        const osrParams = {
            baseEase: 250,
            lapsesIntervalChange: 0.5,
            easyBonus: 1.3,
            loadBalance: true,
            maximumInterval: 36525,
            maxLinkFactor: 1.0,
        };

        const settings: SRSettings = Object.assign({} as SRSettings, {
            osrParams,
        });

        upgradeAlgorithmSettings(settings);
        expect(settings.osrParams as IOsrParameters).toEqual(osrParams);
    });
});
