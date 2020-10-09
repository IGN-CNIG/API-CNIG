import { SourceCode } from "eslint";
export default function getMetrics(sourceCode: SourceCode, ignoreHeaderComments: boolean, cognitiveComplexity?: number): Metrics;
export interface Metrics {
    ncloc: number[];
    commentLines: number[];
    nosonarLines: number[];
    executableLines: number[];
    functions: number;
    statements: number;
    classes: number;
    complexity: number;
    cognitiveComplexity: number;
}
export declare const EMPTY_METRICS: Metrics;
export declare function findLinesOfCode(sourceCode: SourceCode): number[];
export declare function findCommentLines(sourceCode: SourceCode, ignoreHeaderComments: boolean): {
    commentLines: number[];
    nosonarLines: number[];
};
export declare function findExecutableLines(sourceCode: SourceCode): number[];
export declare function countFunctions(sourceCode: SourceCode): number;
export declare function countStatements(sourceCode: SourceCode): number;
export declare function countClasses(sourceCode: SourceCode): number;
export declare function getCyclomaticComplexity(sourceCode: SourceCode): number;
