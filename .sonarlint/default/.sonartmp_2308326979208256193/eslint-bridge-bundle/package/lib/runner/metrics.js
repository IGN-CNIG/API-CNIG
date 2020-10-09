"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visitor_1 = require("../utils/visitor");
const EXECUTABLE_NODES = [
    "ExpressionStatement",
    "IfStatement",
    "LabeledStatement",
    "BreakStatement",
    "ContinueStatement",
    "WithStatement",
    "SwitchStatement",
    "ReturnStatement",
    "ThrowStatement",
    "TryStatement",
    "WhileStatement",
    "DoWhileStatement",
    "ForStatement",
    "ForInStatement",
    "DebuggerStatement",
    "VariableDeclaration",
    "ForOfStatement",
];
const STATEMENT_NODES = [
    "VariableDeclaration",
    "EmptyStatement",
    "ExpressionStatement",
    "IfStatement",
    "DoWhileStatement",
    "WhileStatement",
    "ForInStatement",
    "ForOfStatement",
    "ForStatement",
    "ContinueStatement",
    "BreakStatement",
    "ReturnStatement",
    "WithStatement",
    "SwitchStatement",
    "ThrowStatement",
    "TryStatement",
    "DebuggerStatement",
];
const LOOP_NODES = [
    "ForStatement",
    "ForInStatement",
    "ForOfStatement",
    "WhileStatement",
    "DoWhileStatement",
];
const CONDITIONAL_NODES = ["IfStatement", "ConditionalExpression", "SwitchCase"];
const FUNCTION_NODES = ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"];
const CLASS_NODES = ["ClassDeclaration", "ClassExpression"];
const COMPLEXITY_NODES = [
    ...CONDITIONAL_NODES,
    ...FUNCTION_NODES,
    ...LOOP_NODES,
    "LogicalExpression",
];
function getMetrics(sourceCode, ignoreHeaderComments, cognitiveComplexity = 0) {
    return Object.assign(Object.assign({ ncloc: findLinesOfCode(sourceCode) }, findCommentLines(sourceCode, ignoreHeaderComments)), { executableLines: findExecutableLines(sourceCode), functions: countFunctions(sourceCode), statements: countStatements(sourceCode), classes: countClasses(sourceCode), complexity: getCyclomaticComplexity(sourceCode), cognitiveComplexity });
}
exports.default = getMetrics;
exports.EMPTY_METRICS = {
    ncloc: [],
    commentLines: [],
    nosonarLines: [],
    executableLines: [],
    functions: 0,
    statements: 0,
    classes: 0,
    complexity: 0,
    cognitiveComplexity: 0,
};
function findLinesOfCode(sourceCode) {
    const lines = new Set();
    const tokens = sourceCode.ast.tokens;
    for (const token of tokens) {
        addLines(token.loc.start.line, token.loc.end.line, lines);
    }
    return Array.from(lines).sort((a, b) => a - b);
}
exports.findLinesOfCode = findLinesOfCode;
function findCommentLines(sourceCode, ignoreHeaderComments) {
    const commentLines = new Set();
    const nosonarLines = new Set();
    let comments = sourceCode.ast.comments;
    // ignore header comments -> comments before first token
    const firstToken = sourceCode.getFirstToken(sourceCode.ast);
    if (firstToken && ignoreHeaderComments) {
        const header = sourceCode.getCommentsBefore(firstToken);
        comments = comments.slice(header.length);
    }
    for (const comment of comments) {
        if (comment.loc) {
            const commentValue = comment.value.startsWith("*")
                ? comment.value.substring(1).trim()
                : comment.value.trim();
            if (commentValue.toUpperCase().startsWith("NOSONAR")) {
                addLines(comment.loc.start.line, comment.loc.end.line, nosonarLines);
            }
            else if (commentValue.length > 0) {
                addLines(comment.loc.start.line, comment.loc.end.line, commentLines);
            }
        }
    }
    return {
        commentLines: Array.from(commentLines).sort((a, b) => a - b),
        nosonarLines: Array.from(nosonarLines).sort((a, b) => a - b),
    };
}
exports.findCommentLines = findCommentLines;
function findExecutableLines(sourceCode) {
    const lines = new Set();
    visitor_1.default(sourceCode, node => {
        if (EXECUTABLE_NODES.includes(node.type) && node.loc) {
            lines.add(node.loc.start.line);
        }
    });
    return Array.from(lines).sort((a, b) => a - b);
}
exports.findExecutableLines = findExecutableLines;
function countFunctions(sourceCode) {
    return visitAndCountIf(sourceCode, node => FUNCTION_NODES.includes(node.type));
}
exports.countFunctions = countFunctions;
function countStatements(sourceCode) {
    return visitAndCountIf(sourceCode, node => STATEMENT_NODES.includes(node.type));
}
exports.countStatements = countStatements;
function countClasses(sourceCode) {
    return visitAndCountIf(sourceCode, node => CLASS_NODES.includes(node.type));
}
exports.countClasses = countClasses;
function getCyclomaticComplexity(sourceCode) {
    let complexity = 0;
    visitor_1.default(sourceCode, node => {
        if (COMPLEXITY_NODES.includes(node.type)) {
            complexity++;
        }
    });
    return complexity;
}
exports.getCyclomaticComplexity = getCyclomaticComplexity;
function visitAndCountIf(sourceCode, condition) {
    let results = 0;
    visitor_1.default(sourceCode, node => {
        if (condition(node)) {
            results++;
        }
    });
    return results;
}
function addLines(startLine, endLine, lines) {
    for (let line = startLine; line <= endLine; line++) {
        lines.add(line);
    }
}
//# sourceMappingURL=metrics.js.map