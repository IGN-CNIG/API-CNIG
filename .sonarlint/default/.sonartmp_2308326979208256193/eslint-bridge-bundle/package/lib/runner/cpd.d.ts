import { SourceCode } from "eslint";
import { Location } from "./location";
export default function getCpdTokens(sourceCode: SourceCode): {
    cpdTokens: CpdToken[];
};
export interface CpdToken {
    location: Location;
    image: string;
}
