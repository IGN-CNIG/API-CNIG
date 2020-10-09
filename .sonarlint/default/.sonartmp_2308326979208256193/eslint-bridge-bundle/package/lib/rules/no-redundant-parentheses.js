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
// https://jira.sonarsource.com/browse/RSPEC-1110
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
const utils_1 = require("./utils");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: ["sonar-runtime"],
            },
        ],
    },
    create(context) {
        return {
            "*": function (node) {
                checkRedundantParentheses(context.getSourceCode(), node, context);
            },
        };
    },
};
function checkRedundantParentheses(sourceCode, node, context) {
    const parenthesesPairsAroundNode = getParenthesesPairsAround(sourceCode, node, node);
    const parent = nodes_1.getParent(context);
    // Ignore parentheses pair from the parent node
    if (!!parent && isInParentNodeParentheses(node, parent)) {
        parenthesesPairsAroundNode.pop();
    }
    // One pair of parentheses is allowed for readability purposes
    parenthesesPairsAroundNode.shift();
    parenthesesPairsAroundNode.forEach(parentheses => {
        context.report({
            message: utils_1.toEncodedMessage(`Remove these useless parentheses.`, [
                parentheses.closingParenthesis,
            ]),
            loc: parentheses.openingParenthesis.loc,
        });
    });
}
function getParenthesesPairsAround(sourceCode, start, end) {
    const tokenBefore = sourceCode.getTokenBefore(start);
    const tokenAfter = sourceCode.getTokenAfter(end);
    if (!!tokenBefore && !!tokenAfter && tokenBefore.value === "(" && tokenAfter.value === ")") {
        return [
            { openingParenthesis: tokenBefore, closingParenthesis: tokenAfter },
            ...getParenthesesPairsAround(sourceCode, tokenBefore, tokenAfter),
        ];
    }
    return [];
}
function isInParentNodeParentheses(node, parent) {
    const nodeIsInConditionOfParent = (parent.type === "IfStatement" ||
        parent.type === "WhileStatement" ||
        parent.type === "DoWhileStatement") &&
        parent.test === node;
    const nodeIsArgumentOfCallExpression = (parent.type === "CallExpression" || parent.type === "NewExpression") &&
        parent.arguments.includes(node);
    return nodeIsInConditionOfParent || nodeIsArgumentOfCallExpression;
}
//# sourceMappingURL=no-redundant-parentheses.js.map