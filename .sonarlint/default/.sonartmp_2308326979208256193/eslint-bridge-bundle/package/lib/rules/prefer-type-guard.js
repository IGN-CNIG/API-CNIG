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
// https://jira.sonarsource.com/browse/RSPEC-4322
Object.defineProperty(exports, "__esModule", { value: true });
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
exports.rule = {
    create(context) {
        return {
            "MethodDefinition[kind='method'] FunctionExpression": function (node) {
                checkFunctionLikeDeclaration(node, context);
            },
            FunctionDeclaration(node) {
                checkFunctionLikeDeclaration(node, context);
            },
        };
    },
};
function checkFunctionLikeDeclaration(functionDeclaration, context) {
    if (functionDeclaration.returnType &&
        functionDeclaration.returnType.typeAnnotation.type === "TSTypePredicate") {
        return;
    }
    const body = functionDeclaration.body;
    const returnedExpression = getReturnedExpression(body);
    if (!returnedExpression) {
        return;
    }
    if (isInequalityBinaryExpression(returnedExpression)) {
        const { left, right } = returnedExpression;
        if (isUndefined(right)) {
            checkCastedType(functionDeclaration, left, context);
        }
        else if (isUndefined(left)) {
            checkCastedType(functionDeclaration, right, context);
        }
    }
    else if (isBooleanCall(returnedExpression)) {
        checkCastedType(functionDeclaration, returnedExpression.arguments[0], context);
    }
    else if (isNegation(returnedExpression) && isNegation(returnedExpression.argument)) {
        checkCastedType(functionDeclaration, returnedExpression.argument.argument, context);
    }
}
function getReturnedExpression(block) {
    if (block && block.body.length === 1) {
        const statement = block.body[0];
        if (statement.type === "ReturnStatement") {
            return statement.argument;
        }
    }
    return undefined;
}
function isInequalityBinaryExpression(returnExpression) {
    return (returnExpression.type === "BinaryExpression" &&
        (returnExpression.operator === "!==" || returnExpression.operator === "!="));
}
function checkCastedType(node, expression, context) {
    const sourceCode = context.getSourceCode();
    const castedType = getCastTupleFromMemberExpression(expression);
    if (castedType && castedType[1].type !== "TSAnyKeyword") {
        const nOfParam = node.params.length;
        if (nOfParam === 1 || (nOfParam === 0 && castedType[0].type === "ThisExpression")) {
            const castedExpressionText = sourceCode.getText(castedType[0]);
            const castedTypeText = sourceCode.getText(castedType[1]);
            context.report({
                message: `Declare this function return type using type predicate "${castedExpressionText} is ${castedTypeText}".`,
                loc: locations_1.getMainFunctionTokenLocation(node, nodes_1.getParent(context), context),
            });
        }
    }
}
function getCastTupleFromMemberExpression(node) {
    if (node.type === "MemberExpression") {
        const object = node.object;
        if (object.type === "TSAsExpression" || object.type === "TSTypeAssertion") {
            return [object.expression, object.typeAnnotation];
        }
    }
    return undefined;
}
function isNegation(node) {
    return node.type === "UnaryExpression" && node.prefix && node.operator === "!";
}
function isUndefined(node) {
    return node.type === "Identifier" && node.name === "undefined";
}
function isBooleanCall(node) {
    if (node.type === "CallExpression") {
        const callee = node.callee;
        return node.arguments.length === 1 && callee.type === "Identifier" && callee.name === "Boolean";
    }
    return false;
}
//# sourceMappingURL=prefer-type-guard.js.map