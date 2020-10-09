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
// https://jira.sonarsource.com/browse/RSPEC-1128
Object.defineProperty(exports, "__esModule", { value: true });
const EXCLUDED_IMPORTS = ["React"];
exports.rule = {
    create(context) {
        const unusedImports = [];
        const tsTypeIdentifiers = new Set();
        const saveTypeIdentifier = (node) => tsTypeIdentifiers.add(node.name);
        return {
            ImportDeclaration: (node) => {
                const variables = context.getDeclaredVariables(node);
                for (const variable of variables) {
                    if (!EXCLUDED_IMPORTS.includes(variable.name) && variable.references.length === 0) {
                        unusedImports.push(variable.identifiers[0]);
                    }
                }
            },
            "TSTypeReference > Identifier, TSClassImplements > Identifier, TSInterfaceHeritage > Identifier": (node) => {
                saveTypeIdentifier(node);
            },
            "TSQualifiedName[left.type = 'Identifier']": (node) => {
                saveTypeIdentifier(node.left);
            },
            "TSInterfaceHeritage > MemberExpression[object.type = 'Identifier'], TSClassImplements > MemberExpression[object.type = 'Identifier']": (node) => {
                saveTypeIdentifier(node
                    .object);
            },
            "Program:exit": () => {
                const jsxIdentifiers = context
                    .getSourceCode()
                    .ast.tokens.filter(token => token.type === "JSXIdentifier")
                    .map(token => token.value);
                unusedImports
                    .filter(unused => !jsxIdentifiers.includes(unused.name) && !tsTypeIdentifiers.has(unused.name))
                    .forEach(unused => context.report({
                    message: `Remove this unused import of '${unused.name}'.`,
                    node: unused,
                }));
            },
        };
    },
};
//# sourceMappingURL=unused-import.js.map