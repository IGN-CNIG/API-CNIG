import { ParseExceptionCode } from "./parser";
export declare function getFilesForTsConfig(tsConfig: string): {
    files: string[];
} | {
    error: string;
    errorCode?: ParseExceptionCode;
};
