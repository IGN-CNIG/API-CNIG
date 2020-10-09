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
// https://jira.sonarsource.com/browse/RSPEC-2137
Object.defineProperty(exports, "__esModule", { value: true });
const illegalNames = ["eval", "arguments", "undefined", "NaN", "Infinity"];
const getDeclareMessage = (redeclareType) => (name) => `Do not use "${name}" to declare a ${redeclareType} - use another name.`;
const getModificationMessage = (functionName) => `Remove the modification of "${functionName}".`;
exports.rule = {
    create(context) {
        return {
            "FunctionDeclaration, FunctionExpression": function (node) {
                const func = node;
                reportBadUsageOnFunction(func, func.id, context);
            },
            ArrowFunctionExpression: function (node) {
                reportBadUsageOnFunction(node, undefined, context);
            },
            VariableDeclaration(node) {
                node.declarations.forEach(decl => {
                    reportBadUsage(decl.id, getDeclareMessage("variable"), context);
                });
            },
            UpdateExpression(node) {
                reportBadUsage(node.argument, getModificationMessage, context);
            },
            AssignmentExpression(node) {
                reportBadUsage(node.left, getModificationMessage, context);
            },
            CatchClause(node) {
                reportBadUsage(node.param, getDeclareMessage("variable"), context);
            },
        };
    },
};
function reportBadUsageOnFunction(func, id, context) {
    reportBadUsage(id, getDeclareMessage("function"), context);
    func.params.forEach(p => {
        reportBadUsage(p, getDeclareMessage("parameter"), context);
    });
}
function reportBadUsage(node, buildMessage, context) {
    if (node) {
        switch (node.type) {
            case "Identifier": {
                if (illegalNames.includes(node.name)) {
                    context.report({
                        message: buildMessage(node.name),
                        node: node,
                    });
                }
                break;
            }
            case "RestElement":
                reportBadUsage(node.argument, buildMessage, context);
                break;
            case "ObjectPattern":
                node.properties.forEach(prop => {
                    reportBadUsage(prop.value, buildMessage, context);
                });
                break;
            case "ArrayPattern":
                node.elements.forEach(elem => {
                    reportBadUsage(elem, buildMessage, context);
                });
                break;
            case "AssignmentPattern":
                reportBadUsage(node.left, buildMessage, context);
                break;
        }
    }
}
//# sourceMappingURL=no-globals-shadowing.js.map