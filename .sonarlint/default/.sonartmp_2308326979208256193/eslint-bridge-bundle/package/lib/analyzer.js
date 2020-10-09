"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
const parser_1 = require("./parser");
const highlighter_1 = require("./runner/highlighter");
const metrics_1 = require("./runner/metrics");
const cpd_1 = require("./runner/cpd");
const linter = require("./linter");
const eslint_1 = require("eslint");
const symbol_highlighter_1 = require("./runner/symbol-highlighter");
const fs = require("fs");
const eslint_plugin_sonarjs_1 = require("eslint-plugin-sonarjs");
const COGNITIVE_COMPLEXITY_RULE_ID = "internal-cognitive-complexity";
exports.EMPTY_RESPONSE = {
    issues: [],
    highlights: [],
    highlightedSymbols: [],
    metrics: metrics_1.EMPTY_METRICS,
    cpdTokens: [],
};
exports.SYMBOL_HIGHLIGHTING_RULE = {
    ruleId: symbol_highlighter_1.symbolHighlightingRuleId,
    ruleModule: symbol_highlighter_1.rule,
    ruleConfig: [],
};
exports.COGNITIVE_COMPLEXITY_RULE = {
    ruleId: COGNITIVE_COMPLEXITY_RULE_ID,
    ruleModule: eslint_plugin_sonarjs_1.rules["cognitive-complexity"],
    ruleConfig: ["metric"],
};
function analyzeJavaScript(input) {
    return analyze(input, input.filePath.endsWith(".vue") ? parser_1.parseVueSourceFile : parser_1.parseJavaScriptSourceFile);
}
exports.analyzeJavaScript = analyzeJavaScript;
function analyzeTypeScript(input) {
    return analyze(input, parser_1.parseTypeScriptSourceFile);
}
exports.analyzeTypeScript = analyzeTypeScript;
function getFileContent(filePath) {
    const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    return stripBom(fileContent);
}
function stripBom(s) {
    if (s.charCodeAt(0) === 0xfeff) {
        return s.slice(1);
    }
    return s;
}
function analyze(input, parse) {
    let fileContent = input.fileContent;
    if (!fileContent) {
        fileContent = getFileContent(input.filePath);
    }
    const result = parse(fileContent, input.filePath, input.tsConfigs);
    if (result instanceof eslint_1.SourceCode) {
        return analyzeFile(result, input);
    }
    else {
        return Object.assign(Object.assign({}, exports.EMPTY_RESPONSE), { parsingError: result });
    }
}
function analyzeFile(sourceCode, input) {
    const issues = linter.analyze(sourceCode, input.filePath, input.rules, exports.SYMBOL_HIGHLIGHTING_RULE, exports.COGNITIVE_COMPLEXITY_RULE).issues;
    return {
        issues,
        highlightedSymbols: getHighlightedSymbols(issues),
        highlights: highlighter_1.default(sourceCode).highlights,
        metrics: metrics_1.default(sourceCode, !!input.ignoreHeaderComments, getCognitiveComplexity(issues)),
        cpdTokens: cpd_1.default(sourceCode).cpdTokens,
    };
}
// exported for testing
function getHighlightedSymbols(issues) {
    const issue = findAndRemoveFirstIssue(issues, symbol_highlighter_1.symbolHighlightingRuleId);
    if (issue) {
        return JSON.parse(issue.message);
    }
    else {
        console.log("DEBUG Failed to retrieve symbol highlighting from analysis results");
        return [];
    }
}
exports.getHighlightedSymbols = getHighlightedSymbols;
// exported for testing
function getCognitiveComplexity(issues) {
    const issue = findAndRemoveFirstIssue(issues, COGNITIVE_COMPLEXITY_RULE_ID);
    if (issue && !isNaN(Number(issue.message))) {
        return Number(issue.message);
    }
    else {
        console.log("DEBUG Failed to retrieve cognitive complexity metric from analysis results");
        return 0;
    }
}
exports.getCognitiveComplexity = getCognitiveComplexity;
function findAndRemoveFirstIssue(issues, ruleId) {
    for (const issue of issues) {
        if (issue.ruleId === ruleId) {
            const index = issues.indexOf(issue);
            issues.splice(index, 1);
            return issue;
        }
    }
    return undefined;
}
//# sourceMappingURL=analyzer.js.map