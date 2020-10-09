import { Rule } from "eslint";
declare const ruleModules: {
    [key: string]: Rule.RuleModule;
};
export { ruleModules as rules };
