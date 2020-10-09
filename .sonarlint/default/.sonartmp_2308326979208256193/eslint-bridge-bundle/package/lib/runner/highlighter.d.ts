import { SourceCode } from "eslint";
import { Location } from "./location";
export default function getHighlighting(sourceCode: SourceCode): {
    highlights: Highlight[];
};
export declare type SonarTypeOfText = "CONSTANT" | "COMMENT" | "STRUCTURED_COMMENT" | "KEYWORD" | "STRING";
export interface Highlight {
    location: Location;
    textType: SonarTypeOfText;
}
