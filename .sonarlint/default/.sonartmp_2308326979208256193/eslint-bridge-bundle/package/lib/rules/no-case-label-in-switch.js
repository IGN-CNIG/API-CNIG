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
// https://jira.sonarsource.com/browse/RSPEC-1219
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = {
    create(context) {
        const stack = [0];
        function enterCase() {
            stack.push(stack.pop() + 1);
        }
        function leaveCase() {
            stack.push(stack.pop() - 1);
        }
        function inCase() {
            return stack[stack.length - 1] > 0;
        }
        return {
            SwitchCase: () => {
                enterCase();
            },
            LabeledStatement: (node) => {
                if (inCase()) {
                    const label = node.label;
                    context.report({
                        message: `Remove this misleading "${label.name}" label.`,
                        node: label,
                    });
                }
            },
            "FunctionExpression, FunctionDeclaration": () => {
                stack.push(0);
            },
            "SwitchCase:exit": () => {
                leaveCase();
            },
            "FunctionExpression, FunctionDeclaration :exit": () => {
                stack.pop();
            },
        };
    },
};
//# sourceMappingURL=no-case-label-in-switch.js.map