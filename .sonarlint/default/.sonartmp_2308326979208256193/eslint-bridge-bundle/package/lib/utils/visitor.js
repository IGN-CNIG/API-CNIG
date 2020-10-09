"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function visit(sourceCode, callback) {
    const stack = [sourceCode.ast];
    while (stack.length) {
        const node = stack.pop();
        callback(node);
        stack.push(...childrenOf(node, sourceCode.visitorKeys).reverse());
    }
}
exports.default = visit;
function childrenOf(node, visitorKeys) {
    const keys = visitorKeys[node.type];
    const children = [];
    if (keys) {
        for (const key of keys) {
            const child = node[key];
            if (Array.isArray(child)) {
                children.push(...child);
            }
            else {
                children.push(child);
            }
        }
    }
    return children.filter(Boolean);
}
exports.childrenOf = childrenOf;
//# sourceMappingURL=visitor.js.map