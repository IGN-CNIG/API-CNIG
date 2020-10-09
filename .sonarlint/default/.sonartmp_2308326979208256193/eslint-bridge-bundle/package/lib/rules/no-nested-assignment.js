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
// https://jira.sonarsource.com/browse/RSPEC-1121
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
exports.rule = {
    create(context) {
        return {
            AssignmentExpression: (node) => {
                const assignment = node;
                const parent = parentOf(assignment, context.getAncestors());
                if (parent &&
                    parent.type !== "ExpressionStatement" &&
                    !isArrowFunctionWithAssignmentBody(assignment, context)) {
                    raiseIssue(assignment, context);
                }
            },
        };
    },
};
function raiseIssue(node, context) {
    const sourceCode = context.getSourceCode();
    const operator = sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator);
    const text = sourceCode.getText(node.left);
    context.report({
        message: `Extract the assignment of \"${text}\" from this expression.`,
        loc: operator.loc,
    });
}
function parentOf(node, ancestors) {
    const parent = ancestors.pop();
    if (parent && (parent.type === "SequenceExpression" || parent.type === "AssignmentExpression")) {
        return parentOf(parent, ancestors);
    }
    if (parent && parent.type === "ForStatement" && parent.test !== node) {
        return undefined;
    }
    return parent;
}
function isArrowFunctionWithAssignmentBody(node, context) {
    const parent = nodes_1.getParent(context);
    return parent && parent.type === "ArrowFunctionExpression" && parent.body === node;
}
//# sourceMappingURL=no-nested-assignment.js.map