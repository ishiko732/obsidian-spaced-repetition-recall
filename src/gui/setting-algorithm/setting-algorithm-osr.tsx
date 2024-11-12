import { Notice, PluginSettingTab, Setting } from "obsidian";

import { t } from "src/lang/helpers";
import { DEFAULT_SETTINGS } from "src/settings";
import { ISettingAlgorithmParameter } from "./isetting-algorithm";
import SRPlugin from "src/main";
import { applySettingsUpdate } from "src/utils/debounce";

export class SettingAlgorithmOSR implements ISettingAlgorithmParameter {
    private plugin: SRPlugin;
    private settingTab: PluginSettingTab;

    constructor(plugin: SRPlugin, settingTab: PluginSettingTab) {
        this.plugin = plugin;
        this.settingTab = settingTab;
    }

    async groupSRSParameter(containerEl: HTMLElement): Promise<void> {
        const { osrParams: params } = this.plugin.data.settings;

        new Setting(containerEl)
            .setName(t("BASE_EASE"))
            .setDesc(t("BASE_EASE_DESC"))
            .addText((text) =>
                text.setValue(params.baseEase.toString()).onChange((value) => {
                    applySettingsUpdate(async () => {
                        const numValue: number = Number.parseInt(value);
                        if (!isNaN(numValue)) {
                            if (numValue < 130) {
                                new Notice(t("BASE_EASE_MIN_WARNING"));
                                text.setValue(params.baseEase.toString());
                                return;
                            }

                            params.baseEase = numValue;
                            await this.plugin.savePluginData();
                        } else {
                            new Notice(t("VALID_NUMBER_WARNING"));
                        }
                    });
                }),
            )
            .addExtraButton((button) => {
                button
                    .setIcon("reset")
                    .setTooltip(t("RESET_DEFAULT"))
                    .onClick(async () => {
                        params.baseEase = DEFAULT_SETTINGS.osrParams.baseEase;
                        await this.plugin.savePluginData();

                        this.settingTab.display();
                    });
            });

        new Setting(containerEl)
            .setName(t("LAPSE_INTERVAL_CHANGE"))
            .setDesc(t("LAPSE_INTERVAL_CHANGE_DESC"))
            .addSlider((slider) =>
                slider
                    .setLimits(1, 99, 1)
                    .setValue(params.lapsesIntervalChange * 100)
                    .setDynamicTooltip()
                    .onChange(async (value: number) => {
                        params.lapsesIntervalChange = value / 100;
                        await this.plugin.savePluginData();
                    }),
            )
            .addExtraButton((button) => {
                button
                    .setIcon("reset")
                    .setTooltip(t("RESET_DEFAULT"))
                    .onClick(async () => {
                        params.lapsesIntervalChange =
                            DEFAULT_SETTINGS.osrParams.lapsesIntervalChange;
                        await this.plugin.savePluginData();

                        this.settingTab.display();
                    });
            });

        new Setting(containerEl)
            .setName(t("EASY_BONUS"))
            .setDesc(t("EASY_BONUS_DESC"))
            .addText((text) =>
                text.setValue((params.easyBonus * 100).toString()).onChange((value) => {
                    applySettingsUpdate(async () => {
                        const numValue: number = Number.parseInt(value) / 100;
                        if (!isNaN(numValue)) {
                            if (numValue < 1.0) {
                                new Notice(t("EASY_BONUS_MIN_WARNING"));
                                text.setValue((params.easyBonus * 100).toString());
                                return;
                            }

                            params.easyBonus = numValue;
                            await this.plugin.savePluginData();
                        } else {
                            new Notice(t("VALID_NUMBER_WARNING"));
                        }
                    });
                }),
            )
            .addExtraButton((button) => {
                button
                    .setIcon("reset")
                    .setTooltip(t("RESET_DEFAULT"))
                    .onClick(async () => {
                        params.easyBonus = DEFAULT_SETTINGS.osrParams.easyBonus;
                        await this.plugin.savePluginData();

                        this.settingTab.display();
                    });
            });

        new Setting(containerEl)
            .setName(t("LOAD_BALANCE"))
            .setDesc(t("LOAD_BALANCE_DESC"))
            .addToggle((toggle) =>
                toggle.setValue(params.loadBalance).onChange(async (value) => {
                    params.loadBalance = value;
                    await this.plugin.savePluginData();
                }),
            );

        new Setting(containerEl)
            .setName(t("MAX_INTERVAL"))
            .setDesc(t("MAX_INTERVAL_DESC"))
            .addText((text) =>
                text.setValue(params.maximumInterval.toString()).onChange((value) => {
                    applySettingsUpdate(async () => {
                        const numValue: number = Number.parseInt(value);
                        if (!isNaN(numValue)) {
                            if (numValue < 1) {
                                new Notice(t("MAX_INTERVAL_MIN_WARNING"));
                                text.setValue(params.maximumInterval.toString());
                                return;
                            }

                            params.maximumInterval = numValue;
                            await this.plugin.savePluginData();
                        } else {
                            new Notice(t("VALID_NUMBER_WARNING"));
                        }
                    });
                }),
            )
            .addExtraButton((button) => {
                button
                    .setIcon("reset")
                    .setTooltip(t("RESET_DEFAULT"))
                    .onClick(async () => {
                        params.maximumInterval = DEFAULT_SETTINGS.osrParams.maximumInterval;
                        await this.plugin.savePluginData();

                        this.settingTab.display();
                    });
            });

        new Setting(containerEl)
            .setName(t("MAX_LINK_CONTRIB"))
            .setDesc(t("MAX_LINK_CONTRIB_DESC"))
            .addSlider((slider) =>
                slider
                    .setLimits(0, 100, 1)
                    .setValue(params.maxLinkFactor * 100)
                    .setDynamicTooltip()
                    .onChange(async (value: number) => {
                        params.maxLinkFactor = value / 100;
                        await this.plugin.savePluginData();
                    }),
            )
            .addExtraButton((button) => {
                button
                    .setIcon("reset")
                    .setTooltip(t("RESET_DEFAULT"))
                    .onClick(async () => {
                        params.maxLinkFactor = DEFAULT_SETTINGS.osrParams.maxLinkFactor;
                        await this.plugin.savePluginData();

                        this.settingTab.display();
                    });
            });

        containerEl.createEl("h3", { text: t("GROUP_DATA_STORAGE") });

        new Setting(containerEl)
            .setName(t("GROUP_DATA_STORAGE"))
            .setDesc(t("GROUP_DATA_STORAGE_DESC"))
            .addDropdown((dropdown) =>
                dropdown
                    .addOptions({
                        NOTES: t("STORE_IN_NOTES"),
                    })
                    .setValue(this.plugin.data.settings.dataStore)
                    .onChange(async (value) => {
                        this.plugin.data.settings.dataStore = value;
                        await this.plugin.savePluginData();
                    }),
            );

        new Setting(containerEl)
            .setName(t("INLINE_SCHEDULING_COMMENTS"))
            .setDesc(t("INLINE_SCHEDULING_COMMENTS_DESC"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.data.settings.cardCommentOnSameLine)
                    .onChange(async (value) => {
                        this.plugin.data.settings.cardCommentOnSameLine = value;
                        await this.plugin.savePluginData();
                    }),
            );
    }
}
