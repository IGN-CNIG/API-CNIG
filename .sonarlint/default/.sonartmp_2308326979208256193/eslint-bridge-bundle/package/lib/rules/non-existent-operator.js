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
// https://jira.sonarsource.com/browse/RSPEC-2757
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = {
    create(context) {
        return {
            AssignmentExpression(node) {
                const assignmentExpression = node;
                if (assignmentExpression.operator === "=") {
                    checkOperator(context, assignmentExpression.right);
                }
            },
            VariableDeclarator(node) {
                const variableDeclarator = node;
                checkOperator(context, variableDeclarator.init);
            },
        };
    },
};
function checkOperator(context, unaryNode) {
    if (unaryNode &&
        unaryNode.type === "UnaryExpression" &&
        isUnaryOperatorOfInterest(unaryNode.operator)) {
        const sourceCode = context.getSourceCode();
        const assignmentOperatorToken = sourceCode.getTokenBefore(unaryNode, token => token.value === "=");
        const unaryOperatorToken = sourceCode.getFirstToken(unaryNode);
        const expressionFirstToken = sourceCode.getFirstToken(unaryNode.argument);
        if (assignmentOperatorToken != null &&
            unaryOperatorToken != null &&
            expressionFirstToken != null &&
            areAdjacent(assignmentOperatorToken, unaryOperatorToken) &&
            !areAdjacent(unaryOperatorToken, expressionFirstToken)) {
            context.report({
                message: `Was "${unaryNode.operator}=" meant instead?`,
                loc: { start: assignmentOperatorToken.loc.start, end: unaryOperatorToken.loc.end },
            });
        }
    }
}
function isUnaryOperatorOfInterest(operator) {
    return operator === "-" || operator === "+" || operator === "!";
}
function areAdjacent(first, second) {
    return (first.loc.end.column === second.loc.start.column && first.loc.end.line === second.loc.start.line);
}
//# sourceMappingURL=non-existent-operator.js.map