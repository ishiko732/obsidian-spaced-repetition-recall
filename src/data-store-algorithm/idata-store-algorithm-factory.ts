import { Algorithm } from "src/algorithms/base/isrs-algorithm";
import { DataStoreInNoteAlgorithmOsr } from "src/data-store-algorithm/data-store-in-note-algorithm-osr";
import { SRSettings } from "src/settings";


export function DataStoreAlgorithmFactory(algorithm: Algorithm, settings: SRSettings) {
    switch (algorithm) {
        case Algorithm.SM_2_OSR:
            return new DataStoreInNoteAlgorithmOsr(settings);
        default:
            throw new Error(`Algorithm ${algorithm} not implemented.`);
    }
}
