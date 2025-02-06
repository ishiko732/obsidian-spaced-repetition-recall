import { Platform } from "obsidian";

import { Algorithm } from "src/algorithms/base/isrs-algorithm";
import { IOsrParameters } from "src/algorithms/osr/types";
import { DataStoreName } from "src/data-stores/base/data-store";
import { t } from "src/lang/helpers";
import { pathMatchesPattern } from "src/utils/fs";

export interface SRSettings {
    // flashcards
    flashcardTags: string[];
    convertFoldersToDecks: boolean;
    burySiblingCards: boolean;
    randomizeCardOrder: boolean;
    flashcardCardOrder: string;
    flashcardDeckOrder: string;
    convertHighlightsToClozes: boolean;
    convertBoldTextToClozes: boolean;
    convertCurlyBracketsToClozes: boolean;
    clozePatterns: string[];
    singleLineCardSeparator: string;
    singleLineReversedCardSeparator: string;
    multilineCardSeparator: string;
    multilineReversedCardSeparator: string;
    multilineCardEndMarker: string;
    editLaterTag: string;

    // notes
    enableNoteReviewPaneOnStartup: boolean;
    tagsToReview: string[];
    noteFoldersToIgnore: string[];
    openRandomNote: boolean;
    autoNextNote: boolean;
    disableFileMenuReviewOptions: boolean;
    maxNDaysNotesReviewQueue: number;

    // UI preferences
    showRibbonIcon: boolean;
    showStatusBar: boolean;
    initiallyExpandAllSubdecksInTree: boolean;
    showContextInCards: boolean;
    showIntervalInReviewButtons: boolean;
    flashcardHeightPercentage: number;
    flashcardWidthPercentage: number;
    flashcardEasyText: string;
    flashcardGoodText: string;
    flashcardHardText: string;
    reviewButtonDelay: number;
    openViewInNewTab: boolean;

    // algorithm
    algorithm: Algorithm;
    osrParams: IOsrParameters;

    // storage
    dataStore: string;
    cardCommentOnSameLine: boolean;

    // logging
    showSchedulingDebugMessages: boolean;
    showParserDebugMessages: boolean;
}

export const DEFAULT_SETTINGS: SRSettings = {
    // flashcards
    flashcardTags: ["#flashcards"],
    convertFoldersToDecks: false,
    burySiblingCards: false,
    randomizeCardOrder: null,
    flashcardCardOrder: "DueFirstRandom",
    flashcardDeckOrder: "PrevDeckComplete_Sequential",
    convertHighlightsToClozes: true,
    convertBoldTextToClozes: false,
    convertCurlyBracketsToClozes: false,
    clozePatterns: ["==[123;;]answer[;;hint]=="],
    singleLineCardSeparator: "::",
    singleLineReversedCardSeparator: ":::",
    multilineCardSeparator: "?",
    multilineReversedCardSeparator: "??",
    multilineCardEndMarker: "",
    editLaterTag: "#edit-later",

    // notes
    enableNoteReviewPaneOnStartup: true,
    tagsToReview: ["#review"],
    noteFoldersToIgnore: ["**/*.excalidraw.md"],
    openRandomNote: false,
    autoNextNote: false,
    disableFileMenuReviewOptions: false,
    maxNDaysNotesReviewQueue: 365,

    // UI settings
    showRibbonIcon: true,
    showStatusBar: true,
    initiallyExpandAllSubdecksInTree: false,
    showContextInCards: true,
    showIntervalInReviewButtons: true,
    flashcardHeightPercentage: Platform.isMobile ? 100 : 80,
    flashcardWidthPercentage: Platform.isMobile ? 100 : 40,
    flashcardEasyText: t("EASY"),
    flashcardGoodText: t("GOOD"),
    flashcardHardText: t("HARD"),
    reviewButtonDelay: 0,
    openViewInNewTab: false,

    // algorithm
    algorithm: Algorithm.SM_2_OSR,
    osrParams: {
        baseEase: 250,
        lapsesIntervalChange: 0.5,
        easyBonus: 1.3,
        loadBalance: true,
        maximumInterval: 36525,
        maxLinkFactor: 1.0,
    },

    // storage
    dataStore: DataStoreName.NOTES,
    cardCommentOnSameLine: false,

    // logging
    showSchedulingDebugMessages: false,
    showParserDebugMessages: false,
};

export function upgradeSettings(settings: SRSettings) {
    if (
        settings.randomizeCardOrder != null &&
        settings.flashcardCardOrder == null &&
        settings.flashcardDeckOrder == null
    ) {
        settings.flashcardCardOrder = settings.randomizeCardOrder
            ? "DueFirstRandom"
            : "DueFirstSequential";
        settings.flashcardDeckOrder = "PrevDeckComplete_Sequential";

        // After the upgrade, we don't need the old attribute any more
        settings.randomizeCardOrder = null;
    }

    if (settings.clozePatterns == null) {
        settings.clozePatterns = [];

        if (settings.convertHighlightsToClozes)
            settings.clozePatterns.push("==[123;;]answer[;;hint]==");

        if (settings.convertBoldTextToClozes)
            settings.clozePatterns.push("**[123;;]answer[;;hint]**");

        if (settings.convertCurlyBracketsToClozes)
            settings.clozePatterns.push("{{[123;;]answer[;;hint]}}");
    }
}

export function upgradeAlgorithmSettings(settings: SRSettings) {
    if (settings.osrParams == null) {
        const osrParams = Object.assign({}, DEFAULT_SETTINGS.osrParams);
        if ("baseEase" in settings) osrParams.baseEase = settings.baseEase as number;
        if ("lapsesIntervalChange" in settings)
            osrParams.lapsesIntervalChange = settings.lapsesIntervalChange as number;
        if ("easyBonus" in settings) osrParams.easyBonus = settings.easyBonus as number;
        if ("loadBalance" in settings) osrParams.loadBalance = settings.loadBalance as boolean;
        if ("maximumInterval" in settings)
            osrParams.maximumInterval = settings.maximumInterval as number;
        if ("maxLinkFactor" in settings) osrParams.maxLinkFactor = settings.maxLinkFactor as number;
        Object.assign(settings, { osrParams });

        // After the upgrade, we don't need the old attributes any more
        Reflect.deleteProperty(settings, "baseEase");
        Reflect.deleteProperty(settings, "lapsesIntervalChange");
        Reflect.deleteProperty(settings, "easyBonus");
        Reflect.deleteProperty(settings, "loadBalance");
        Reflect.deleteProperty(settings, "maximumInterval");
        Reflect.deleteProperty(settings, "maxLinkFactor");
    }
}

export class SettingsUtil {
    static isFlashcardTag(settings: SRSettings, tag: string): boolean {
        return SettingsUtil.isTagInList(settings.flashcardTags, tag);
    }

    static isPathInNoteIgnoreFolder(settings: SRSettings, path: string): boolean {
        return settings.noteFoldersToIgnore.some((folder) => pathMatchesPattern(path, folder));
    }

    static isAnyTagANoteReviewTag(settings: SRSettings, tags: string[]): boolean {
        for (const tag of tags) {
            if (
                settings.tagsToReview.some(
                    (tagToReview) => tag === tagToReview || tag.startsWith(tagToReview + "/"),
                )
            ) {
                return true;
            }
        }
        return false;
    }

    // Given a list of tags, return the subset that is in settings.tagsToReview
    static filterForNoteReviewTag(settings: SRSettings, tags: string[]): string[] {
        const result: string[] = [];
        for (const tagToReview of settings.tagsToReview) {
            if (tags.some((tag) => tag === tagToReview || tag.startsWith(tagToReview + "/"))) {
                result.push(tagToReview);
            }
        }
        return result;
    }

    private static isTagInList(tagList: string[], tag: string): boolean {
        for (const tagFromList of tagList) {
            if (tag === tagFromList || tag.startsWith(tagFromList + "/")) {
                return true;
            }
        }
        return false;
    }
}
