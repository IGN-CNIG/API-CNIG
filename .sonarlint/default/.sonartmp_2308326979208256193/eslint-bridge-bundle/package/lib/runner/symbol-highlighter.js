"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbolHighlightingRuleId = "internal-symbol-highlighting";
/**
 * Using rule as we need to access declared variables which are available only with RuleContext
 */
exports.rule = {
    create(context) {
        let variables;
        return {
            Program() {
                // clear "variables" for each file
                variables = new Set();
            },
            "*": (node) => {
                context.getDeclaredVariables(node).forEach(v => variables.add(v));
            },
            "Program:exit": (node) => {
                const result = [];
                variables.forEach(v => {
                    // if variable is initialized during declaration it is part of references as well
                    // so we merge declarations and references to remove duplicates and take the earliest in the file as the declaration
                    const allRef = [...new Set([...v.identifiers, ...v.references.map(r => r.identifier)])]
                        .filter(i => !!i.loc)
                        .sort((a, b) => a.loc.start.line - b.loc.start.line);
                    const declaration = allRef[0];
                    const highlightedSymbol = {
                        declaration: location(declaration.loc),
                        references: allRef.slice(1).map(r => location(r.loc)),
                    };
                    result.push(highlightedSymbol);
                });
                const openCurlyBracesStack = [];
                context.getSourceCode().ast.tokens.forEach(token => {
                    if (token.type === "Punctuator") {
                        if (token.value === "{") {
                            openCurlyBracesStack.push(token);
                        }
                        if (token.value === "}") {
                            const highlightedSymbol = {
                                declaration: location(openCurlyBracesStack.pop().loc),
                                references: [location(token.loc)],
                            };
                            result.push(highlightedSymbol);
                        }
                    }
                });
                // as issues are the only communication channel of a rule
                // we pass data as serialized json as an issue message
                context.report({ node, message: JSON.stringify(result) });
            },
        };
    },
};
function location(loc) {
    return {
        startLine: loc.start.line,
        startCol: loc.start.column,
        endLine: loc.end.line,
        endCol: loc.end.column,
    };
}
//# sourceMappingURL=symbol-highlighter.js.map