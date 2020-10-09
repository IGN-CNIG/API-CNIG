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
// https://jira.sonarsource.com/browse/RSPEC-3616
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = {
    create(context) {
        function reportIssue(node, clause, nestingLvl) {
            context.report({
                message: `Explicitly specify ${nestingLvl} separate cases that fall through; currently this case clause only works for "${getTextFromNode(clause)}".`,
                node,
            });
        }
        function getTextFromNode(node) {
            if (node.type === "Literal") {
                return node.value;
            }
            else {
                return context.getSourceCode().getText(node);
            }
        }
        return {
            "SwitchCase > SequenceExpression": function (node) {
                const expressions = node.expressions;
                reportIssue(node, expressions[expressions.length - 1], expressions.length);
            },
            "SwitchCase > LogicalExpression": function (node) {
                const firstElemAndNesting = getFirstElementAndNestingLevel(node, 0);
                if (firstElemAndNesting) {
                    reportIssue(node, firstElemAndNesting[0], firstElemAndNesting[1] + 1);
                }
            },
        };
    },
};
function getFirstElementAndNestingLevel(logicalExpression, currentLvl) {
    if (logicalExpression.operator === "||") {
        if (logicalExpression.left.type === "LogicalExpression") {
            return getFirstElementAndNestingLevel(logicalExpression.left, currentLvl + 1);
        }
        else {
            return [logicalExpression.left, currentLvl + 1];
        }
    }
    return undefined;
}
//# sourceMappingURL=comma-or-logical-or-case.js.map