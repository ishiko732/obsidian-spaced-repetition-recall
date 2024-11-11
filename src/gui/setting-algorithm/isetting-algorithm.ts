export interface ISettingAlgorithmParameter {
    groupSRSParameter(containerEl: HTMLElement): Promise<void>;
    clear(): Promise<void>;
}
