import { Algorithm } from "src/algorithms/base/isrs-algorithm";
import { SRSettings } from "src/settings";
import { DataStoreInNoteAlgorithmOsr } from "./data-store-in-note-algorithm-osr";

export function DataStoreAlgorithmFactory(algorithm: Algorithm, settings: SRSettings) {
    switch (algorithm) {
        case Algorithm.SM_2_OSR:
            return new DataStoreInNoteAlgorithmOsr(settings);
        default:
            throw new Error(`Algorithm ${algorithm} not implemented.`);
    }
}
