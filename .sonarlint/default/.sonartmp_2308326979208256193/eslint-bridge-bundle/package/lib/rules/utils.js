"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionLike = new Set([
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
    "MethodDefinition",
]);
exports.sortLike = ["sort", '"sort"', "'sort'"];
exports.FUNCTION_NODES = [
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
];
/**
 * Returns the module name, when an identifier represents a namespace for that module.
 * Returns undefined otherwise.
 * example: Given `import * as X from 'module_name'`, `getModuleNameOfIdentifier(X)` returns `module_name`
 */
function getModuleNameOfIdentifier(identifier, context) {
    const { name } = identifier;
    // check if importing using `import * as X from 'module_name'`
    const importDeclaration = getImportDeclarations(context).find(importDecl => isNamespaceSpecifier(importDecl, name));
    if (importDeclaration) {
        return importDeclaration.source;
    }
    // check if importing using `const X = require('module_name')`
    const writeExpression = getUniqueWriteUsage(context, name);
    if (writeExpression) {
        return getModuleNameFromRequire(writeExpression);
    }
    return undefined;
}
exports.getModuleNameOfIdentifier = getModuleNameOfIdentifier;
/**
 * Returns the module name, when an identifier represents a binding imported from another module.
 * Returns undefined otherwise.
 * example: Given `import { f } from 'module_name'`, `getModuleNameOfImportedIdentifier(f)` returns `module_name`
 */
function getModuleNameOfImportedIdentifier(identifier, context) {
    // check if importing using `import { f } from 'module_name'`
    const importedDeclaration = getImportDeclarations(context).find(({ specifiers }) => specifiers.some(spec => spec.type === "ImportSpecifier" && spec.imported.name === identifier.name));
    if (importedDeclaration) {
        return importedDeclaration.source;
    }
    // check if importing using `const f = require('module_name').f`
    const writeExpression = getUniqueWriteUsage(context, identifier.name);
    if (writeExpression &&
        writeExpression.type === "MemberExpression" &&
        isIdentifier(writeExpression.property, identifier.name)) {
        return getModuleNameFromRequire(writeExpression.object);
    }
    return undefined;
}
exports.getModuleNameOfImportedIdentifier = getModuleNameOfImportedIdentifier;
function getImportDeclarations(context) {
    const program = context.getAncestors().find(node => node.type === "Program");
    if (program.sourceType === "module") {
        return program.body.filter(node => node.type === "ImportDeclaration");
    }
    return [];
}
function isNamespaceSpecifier(importDeclaration, name) {
    return importDeclaration.specifiers.some(({ type, local }) => type === "ImportNamespaceSpecifier" && local.name === name);
}
function getModuleNameFromRequire(node) {
    if (node.type === "CallExpression" &&
        isIdentifier(node.callee, "require") &&
        node.arguments.length === 1) {
        const moduleName = node.arguments[0];
        if (moduleName.type === "Literal") {
            return moduleName;
        }
    }
    return undefined;
}
function getUniqueWriteUsage(context, name) {
    const variable = getVariableFromName(context, name);
    if (variable) {
        const writeReferences = variable.references.filter(reference => reference.isWrite());
        if (writeReferences.length === 1 && writeReferences[0].writeExpr) {
            return writeReferences[0].writeExpr;
        }
    }
    return undefined;
}
function getVariableFromName(context, name) {
    let scope = context.getScope();
    let variable;
    while (variable == null && scope != null) {
        variable = scope.variables.find(value => value.name === name);
        scope = scope.upper;
    }
    return variable;
}
exports.getVariableFromName = getVariableFromName;
function isIdentifier(node, ...values) {
    return node.type === "Identifier" && values.some(value => value === node.name);
}
exports.isIdentifier = isIdentifier;
function isMemberWithProperty(node, ...values) {
    return node.type === "MemberExpression" && isIdentifier(node.property, ...values);
}
exports.isMemberWithProperty = isMemberWithProperty;
function isMemberExpression(node, objectValue, ...propertyValue) {
    if (node.type === "MemberExpression") {
        const { object, property } = node;
        if (isIdentifier(object, objectValue) && isIdentifier(property, ...propertyValue)) {
            return true;
        }
    }
    return false;
}
exports.isMemberExpression = isMemberExpression;
function isUnaryExpression(node) {
    return node !== undefined && node.type === "UnaryExpression";
}
exports.isUnaryExpression = isUnaryExpression;
function isArrayExpression(node) {
    return node !== undefined && node.type === "ArrayExpression";
}
exports.isArrayExpression = isArrayExpression;
function isRequireModule(node, ...moduleNames) {
    if (isIdentifier(node.callee, "require") && node.arguments.length === 1) {
        const argument = node.arguments[0];
        if (argument.type === "Literal") {
            return moduleNames.includes(String(argument.value));
        }
    }
    return false;
}
exports.isRequireModule = isRequireModule;
function toEncodedMessage(message, secondaryLocationsHolder, secondaryMessages, cost) {
    const encodedMessage = {
        message,
        cost,
        secondaryLocations: secondaryLocationsHolder.map((locationHolder, index) => toSecondaryLocation(locationHolder, !!secondaryMessages ? secondaryMessages[index] : undefined)),
    };
    return JSON.stringify(encodedMessage);
}
exports.toEncodedMessage = toEncodedMessage;
function toSecondaryLocation(locationHolder, message) {
    return {
        message,
        column: locationHolder.loc.start.column,
        line: locationHolder.loc.start.line,
        endColumn: locationHolder.loc.end.column,
        endLine: locationHolder.loc.end.line,
    };
}
function findFirstMatchingLocalAncestor(node, predicate) {
    return localAncestorsChain(node).find(predicate);
}
exports.findFirstMatchingLocalAncestor = findFirstMatchingLocalAncestor;
function findFirstMatchingAncestor(node, predicate) {
    return ancestorsChain(node, new Set()).find(predicate);
}
exports.findFirstMatchingAncestor = findFirstMatchingAncestor;
function localAncestorsChain(node) {
    return ancestorsChain(node, exports.functionLike);
}
exports.localAncestorsChain = localAncestorsChain;
function ancestorsChain(node, boundaryTypes) {
    const chain = [];
    let currentNode = node.parent;
    while (currentNode) {
        chain.push(currentNode);
        if (boundaryTypes.has(currentNode.type)) {
            break;
        }
        currentNode = currentNode.parent;
    }
    return chain;
}
exports.ancestorsChain = ancestorsChain;
/**
 * Detect expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 *  myObj.prop1 = 3;
 *  myObj.prop1 += 3;
 */
function isElementWrite(statement, ref) {
    if (statement.expression.type === "AssignmentExpression") {
        const assignmentExpression = statement.expression;
        const lhs = assignmentExpression.left;
        return isMemberExpressionReference(lhs, ref);
    }
    return false;
}
exports.isElementWrite = isElementWrite;
function isMemberExpressionReference(lhs, ref) {
    return (lhs.type === "MemberExpression" &&
        (isReferenceTo(ref, lhs.object) || isMemberExpressionReference(lhs.object, ref)));
}
function isReferenceTo(ref, node) {
    return node.type === "Identifier" && node === ref.identifier;
}
exports.isReferenceTo = isReferenceTo;
function resolveIdentifiers(node, acceptShorthand = false) {
    const identifiers = [];
    resolveIdentifiersAcc(node, identifiers, acceptShorthand);
    return identifiers;
}
exports.resolveIdentifiers = resolveIdentifiers;
function resolveIdentifiersAcc(node, identifiers, acceptShorthand) {
    if (!node) {
        return;
    }
    switch (node.type) {
        case "Identifier":
            identifiers.push(node);
            break;
        case "ObjectPattern":
            node.properties.forEach(prop => resolveIdentifiersAcc(prop, identifiers, acceptShorthand));
            break;
        case "ArrayPattern":
            node.elements.forEach(elem => resolveIdentifiersAcc(elem, identifiers, acceptShorthand));
            break;
        case "Property":
            if (acceptShorthand || !node.shorthand) {
                resolveIdentifiersAcc(node.value, identifiers, acceptShorthand);
            }
            break;
        case "RestElement":
            resolveIdentifiersAcc(node.argument, identifiers, acceptShorthand);
            break;
        case "AssignmentPattern":
            resolveIdentifiersAcc(node.left, identifiers, acceptShorthand);
            break;
        case "TSParameterProperty":
            resolveIdentifiersAcc(node.parameter, identifiers, acceptShorthand);
            break;
    }
}
function isArray(node, services) {
    const type = getTypeFromTreeNode(node, services);
    return type.symbol && type.symbol.name === "Array";
}
exports.isArray = isArray;
function getTypeFromTreeNode(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getTypeFromTreeNode = getTypeFromTreeNode;
function getTypeAsString(node, services) {
    const { typeToString, getBaseTypeOfLiteralType } = services.program.getTypeChecker();
    return typeToString(getBaseTypeOfLiteralType(getTypeFromTreeNode(node, services)));
}
exports.getTypeAsString = getTypeAsString;
function getSymbolAtLocation(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getSymbolAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSymbolAtLocation = getSymbolAtLocation;
function getSignatureFromCallee(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getResolvedSignature(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSignatureFromCallee = getSignatureFromCallee;
function isFunctionNode(node) {
    return exports.FUNCTION_NODES.includes(node.type);
}
exports.isFunctionNode = isFunctionNode;
//# sourceMappingURL=utils.js.map