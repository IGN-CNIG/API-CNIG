"use strict";
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
// https://jira.sonarsource.com/browse/RSPEC-4043
Object.defineProperty(exports, "__esModule", { value: true });
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
const utils_1 = require("./utils");
const arrayMutatingMethods = ["reverse", "'reverse'", '"reverse"', ...utils_1.sortLike];
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (isRequiredParserServices_1.isRequiredParserServices(services)) {
            const ts = require("typescript");
            return {
                CallExpression(node) {
                    const callee = node.callee;
                    if (callee.type === "MemberExpression") {
                        const propertyText = context.getSourceCode().getText(callee.property);
                        if (isArrayMutatingCall(callee, services, propertyText)) {
                            const mutatedArray = callee.object;
                            if (isIdentifierOrPropertyAccessExpression(mutatedArray, services, ts) &&
                                !isInSelfAssignment(mutatedArray, node) &&
                                isForbiddenOperation(node)) {
                                context.report({
                                    message: formatMessage(propertyText),
                                    node,
                                });
                            }
                        }
                    }
                },
            };
        }
        return {};
    },
};
function formatMessage(mutatingMethod) {
    let mutatingMethodText;
    if (mutatingMethod.startsWith('"') || mutatingMethod.startsWith("'")) {
        mutatingMethodText = mutatingMethod.substr(1, mutatingMethod.length - 2);
    }
    else {
        mutatingMethodText = mutatingMethod;
    }
    return `Move this array "${mutatingMethodText}" operation to a separate statement.`;
}
function isArrayMutatingCall(memberExpression, services, propertyText) {
    return arrayMutatingMethods.includes(propertyText) && utils_1.isArray(memberExpression.object, services);
}
function isIdentifierOrPropertyAccessExpression(node, services, ts) {
    return (node.type === "Identifier" ||
        (node.type === "MemberExpression" && !isGetAccessor(node.property, services, ts)));
}
function isGetAccessor(node, services, ts) {
    const symbol = utils_1.getSymbolAtLocation(node, services);
    const declarations = symbol && symbol.declarations;
    return (declarations !== undefined &&
        declarations.length === 1 &&
        declarations[0].kind === ts.SyntaxKind.GetAccessor);
}
function isInSelfAssignment(mutatedArray, node) {
    const parent = node.parent;
    return (
    // check assignment
    parent !== undefined &&
        parent.type === "AssignmentExpression" &&
        parent.operator === "=" &&
        parent.left.type === "Identifier" &&
        mutatedArray.type === "Identifier" &&
        parent.left.name === mutatedArray.name);
}
function isForbiddenOperation(node) {
    const parent = node.parent;
    return (parent &&
        parent.type !== "ExpressionStatement" &&
        utils_1.findFirstMatchingLocalAncestor(node, n => n.type === "ReturnStatement") ===
            undefined);
}
//# sourceMappingURL=no-misleading-array-reverse.js.map