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
// https://jira.sonarsource.com/browse/RSPEC-4324
Object.defineProperty(exports, "__esModule", { value: true });
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
const message = "Remove this return type or change it to a more specific.";
let ts;
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (isRequiredParserServices_1.isRequiredParserServices(services)) {
            ts = require("typescript");
            const returnedExpressions = [];
            return {
                ReturnStatement(node) {
                    if (returnedExpressions.length > 0) {
                        returnedExpressions[returnedExpressions.length - 1].push(node.argument);
                    }
                },
                FunctionDeclaration: function () {
                    returnedExpressions.push([]);
                },
                "FunctionDeclaration:exit": function (node) {
                    const returnType = node.returnType;
                    if (returnType &&
                        returnType.typeAnnotation.type === "TSAnyKeyword" &&
                        returnedExpressions.length > 0 &&
                        allReturnTypesEqual(returnedExpressions[returnedExpressions.length - 1], services)) {
                        context.report({
                            message,
                            loc: returnType.loc,
                        });
                    }
                    returnedExpressions.pop();
                },
            };
        }
        return {};
    },
};
function allReturnTypesEqual(returns, services) {
    const firstReturnType = getTypeFromTreeNode(returns.pop(), services);
    if (!!firstReturnType && !!isPrimitiveType(firstReturnType)) {
        return returns.every(nextReturn => {
            const nextReturnType = getTypeFromTreeNode(nextReturn, services);
            return !!nextReturnType && nextReturnType.flags === firstReturnType.flags;
        });
    }
    return false;
}
function getTypeFromTreeNode(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
function isPrimitiveType({ flags }) {
    return (flags & ts.TypeFlags.BooleanLike ||
        flags & ts.TypeFlags.NumberLike ||
        flags & ts.TypeFlags.StringLike ||
        flags & ts.TypeFlags.EnumLike);
}
//# sourceMappingURL=no-return-type-any.js.map