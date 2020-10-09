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
// https://jira.sonarsource.com/browse/RSPEC-1533
Object.defineProperty(exports, "__esModule", { value: true });
const WRAPPER_TYPES = ["Boolean", "Number", "String"];
exports.rule = {
    create(context) {
        return {
            NewExpression(node) {
                const constructor = node.callee;
                if (constructor.type === "Identifier" && WRAPPER_TYPES.includes(constructor.name)) {
                    context.report({
                        message: `Remove this use of "${constructor.name}" constructor.`,
                        node,
                    });
                }
            },
            TSTypeReference(node) {
                const typeString = context.getSourceCode().getText(node);
                if (WRAPPER_TYPES.includes(typeString)) {
                    context.report({
                        message: `Replace this "${typeString}" wrapper object with primitive type "${typeString.toLowerCase()}".`,
                        node,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=no-primitive-wrappers.js.map