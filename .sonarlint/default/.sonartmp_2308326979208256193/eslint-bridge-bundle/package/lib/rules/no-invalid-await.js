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
// https://jira.sonarsource.com/browse/RSPEC-4123
Object.defineProperty(exports, "__esModule", { value: true });
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
const utils_1 = require("./utils");
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (isRequiredParserServices_1.isRequiredParserServices(services)) {
            const ts = require("typescript");
            return {
                AwaitExpression: (node) => {
                    const awaitedType = utils_1.getTypeFromTreeNode(node.argument, services);
                    if (!hasThenMethod(awaitedType, ts) &&
                        !isAny(awaitedType, ts) &&
                        !isUnion(awaitedType, ts)) {
                        context.report({
                            message: "Refactor this redundant 'await' on a non-promise.",
                            node,
                        });
                    }
                },
            };
        }
        return {};
    },
};
function hasThenMethod(type, ts) {
    const thenProperty = type.getProperty("then");
    return Boolean(thenProperty && thenProperty.flags & ts.SymbolFlags.Method);
}
function isAny(type, ts) {
    return Boolean(type.flags & ts.TypeFlags.Any);
}
function isUnion(type, ts) {
    return Boolean(type.flags & ts.TypeFlags.Union);
}
//# sourceMappingURL=no-invalid-await.js.map