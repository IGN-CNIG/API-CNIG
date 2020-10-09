/// <reference types="node" />
import { Server } from "http";
import { AnalysisInput, AnalysisResponse } from "./analyzer";
export declare function start(port?: number): Promise<Server>;
declare type AnalysisFunction = (input: AnalysisInput) => AnalysisResponse;
export declare function startServer(port: number | undefined, analyzeJS: AnalysisFunction, analyzeTS: AnalysisFunction): Promise<Server>;
export {};
