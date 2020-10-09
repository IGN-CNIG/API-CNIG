import { Rule } from "eslint";
import { Location } from "./location";
export declare const symbolHighlightingRuleId = "internal-symbol-highlighting";
/**
 * Using rule as we need to access declared variables which are available only with RuleContext
 */
export declare const rule: Rule.RuleModule;
export interface HighlightedSymbol {
    declaration: Location;
    references: Location[];
}
