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
// https://jira.sonarsource.com/browse/RSPEC-2068
Object.defineProperty(exports, "__esModule", { value: true });
const MESSAGE = "Review this potentially hardcoded credential.";
exports.rule = {
    create(context) {
        const variableNames = context.options;
        const literalRegExp = variableNames.map(name => new RegExp(`${name}=.+`));
        return {
            VariableDeclarator: (node) => {
                const declaration = node;
                checkAssignment(context, variableNames, declaration.id, declaration.init);
            },
            AssignmentExpression: (node) => {
                const assignment = node;
                checkAssignment(context, variableNames, assignment.left, assignment.right);
            },
            Property: (node) => {
                const property = node;
                checkAssignment(context, variableNames, property.key, property.value);
            },
            Literal: (node) => {
                const literal = node;
                checkLiteral(context, literalRegExp, literal);
            },
        };
    },
};
function checkAssignment(context, patterns, variable, initializer) {
    if (initializer &&
        isStringLiteral(initializer) &&
        initializer.value.length > 0 &&
        patterns.some(pattern => context
            .getSourceCode()
            .getText(variable)
            .includes(pattern))) {
        context.report({
            message: MESSAGE,
            node: initializer,
        });
    }
}
function checkLiteral(context, patterns, literal) {
    if (isStringLiteral(literal) && patterns.some(pattern => pattern.test(literal.value))) {
        context.report({
            message: MESSAGE,
            node: literal,
        });
    }
}
function isStringLiteral(node) {
    return node.type === "Literal" && typeof node.value === "string";
}
//# sourceMappingURL=no-hardcoded-credentials.js.map