import { SRSettings } from "src/settings";
import { SrsAlgorithmOsr } from "../osr/srs-algorithm-osr";
import { Algorithm } from "./isrs-algorithm";

export function SRSAlgorithmFactory(algorithm: Algorithm, parameters: SRSettings) {
    switch (algorithm) {
        case Algorithm.SM_2_OSR:
            return new SrsAlgorithmOsr(parameters);
        default:
            throw new Error(`Algorithm ${algorithm} not implemented.`);
    }
}
