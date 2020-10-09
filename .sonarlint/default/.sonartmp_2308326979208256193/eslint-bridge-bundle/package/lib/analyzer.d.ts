import { ParseExceptionCode } from "./parser";
import { Highlight } from "./runner/highlighter";
import { Metrics } from "./runner/metrics";
import { CpdToken } from "./runner/cpd";
import * as linter from "./linter";
import { HighlightedSymbol } from "./runner/symbol-highlighter";
export declare const EMPTY_RESPONSE: AnalysisResponse;
export declare const SYMBOL_HIGHLIGHTING_RULE: linter.AdditionalRule;
export declare const COGNITIVE_COMPLEXITY_RULE: linter.AdditionalRule;
export interface AnalysisInput {
    filePath: string;
    fileContent: string | undefined;
    rules: Rule[];
    ignoreHeaderComments?: boolean;
    tsConfigs?: string[];
}
export interface Rule {
    key: string;
    configurations: any[];
}
export interface AnalysisResponse {
    parsingError?: ParsingError;
    issues: Issue[];
    highlights: Highlight[];
    highlightedSymbols: HighlightedSymbol[];
    metrics: Metrics;
    cpdTokens: CpdToken[];
}
export interface ParsingError {
    line?: number;
    message: string;
    code: ParseExceptionCode;
}
export interface Issue {
    column: number;
    line: number;
    endColumn?: number;
    endLine?: number;
    ruleId: string;
    message: string;
    cost?: number;
    secondaryLocations: IssueLocation[];
}
export interface IssueLocation {
    column: number;
    line: number;
    endColumn: number;
    endLine: number;
    message?: string;
}
export declare function analyzeJavaScript(input: AnalysisInput): AnalysisResponse;
export declare function analyzeTypeScript(input: AnalysisInput): AnalysisResponse;
export declare function getHighlightedSymbols(issues: Issue[]): any;
export declare function getCognitiveComplexity(issues: Issue[]): number;
