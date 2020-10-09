"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getHighlighting(sourceCode) {
    const highlights = [];
    for (const token of sourceCode.ast.tokens) {
        switch (token.type) {
            case "Keyword":
                highlight(token, "KEYWORD", highlights);
                break;
            case "String":
            case "Template":
                highlight(token, "STRING", highlights);
                break;
            case "Numeric":
                highlight(token, "CONSTANT", highlights);
                break;
        }
    }
    for (const comment of sourceCode.ast.comments) {
        if (comment.type === "Block" && comment.value.startsWith("*")) {
            highlight(comment, "STRUCTURED_COMMENT", highlights);
        }
        else {
            highlight(comment, "COMMENT", highlights);
        }
    }
    return { highlights };
}
exports.default = getHighlighting;
function highlight(node, highlightKind, highlights) {
    if (!node.loc) {
        return;
    }
    const startPosition = node.loc.start;
    const endPosition = node.loc.end;
    highlights.push({
        location: {
            startLine: startPosition.line,
            startCol: startPosition.column,
            endLine: endPosition.line,
            endCol: endPosition.column,
        },
        textType: highlightKind,
    });
}
//# sourceMappingURL=highlighter.js.map