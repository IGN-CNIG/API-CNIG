import { SourceCode, Rule as ESLintRule } from "eslint";
import { Rule, Issue } from "./analyzer";
export interface AdditionalRule {
    ruleId: string;
    ruleModule: ESLintRule.RuleModule;
    ruleConfig: any[];
}
/**
 * 'additionalRules' - rules used for computing metrics (incl. highlighting) when it requires access to the rule context; resulting value is encoded in the message
 */
export declare function analyze(sourceCode: SourceCode, filePath: string, inputRules: Rule[], ...additionalRules: AdditionalRule[]): {
    issues: Issue[];
};
export declare function decodeSonarRuntimeIssue(ruleModule: ESLintRule.RuleModule | undefined, issue: Issue): Issue | null;
/**
 * 'sonar-runtime' is the option used by eslint-plugin-sonarjs rules to distinguish
 *  when they are executed in a sonar* context or in eslint
 *
 * exported for testing
 */
export declare function getRuleConfig(ruleModule: ESLintRule.RuleModule | undefined, inputRule: Rule): any[];
