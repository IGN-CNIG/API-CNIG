import { Linter, SourceCode } from "eslint";
import { ParsingError } from "./analyzer";
export declare const PARSER_CONFIG_MODULE: Linter.ParserOptions;
export declare const PARSER_CONFIG_SCRIPT: Linter.ParserOptions;
export declare type Parse = (fileContent: string, filePath: string, tsConfigs?: string[]) => SourceCode | ParsingError;
export declare function parseJavaScriptSourceFile(fileContent: string): SourceCode | ParsingError;
export declare function parseTypeScriptSourceFile(fileContent: string, filePath: string, tsConfigs?: string[]): SourceCode | ParsingError;
export declare function checkTypeScriptVersionCompatibility(currentVersion: string): void;
export declare function unloadTypeScriptEslint(): void;
export declare function parseVueSourceFile(fileContent: string): SourceCode | ParsingError;
export declare function parse(parse: Function, config: Linter.ParserOptions, fileContent: string): SourceCode | ParseException;
export declare type ParseException = {
    lineNumber?: number;
    message: string;
    code: string;
};
export declare enum ParseExceptionCode {
    Parsing = "PARSING",
    MissingTypeScript = "MISSING_TYPESCRIPT",
    UnsupportedTypeScript = "UNSUPPORTED_TYPESCRIPT",
    GeneralError = "GENERAL_ERROR"
}
export declare function parseExceptionCodeOf(exceptionMsg: string): ParseExceptionCode;
