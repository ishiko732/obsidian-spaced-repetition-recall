import { Algorithm } from "src/algorithms/base/isrs-algorithm";
import { SrsAlgorithmOsr } from "src/algorithms/osr/srs-algorithm-osr";
import { SRSettings } from "src/settings";

export function SRSAlgorithmFactory(algorithm: Algorithm, settings: SRSettings) {
    switch (algorithm) {
        case Algorithm.SM_2_OSR:
            return new SrsAlgorithmOsr(settings);
        default:
            throw new Error(`Algorithm ${algorithm} not implemented.`);
    }
}
