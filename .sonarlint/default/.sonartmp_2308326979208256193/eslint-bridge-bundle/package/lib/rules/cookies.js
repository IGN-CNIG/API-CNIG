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
// https://jira.sonarsource.com/browse/RSPEC-2255
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const message = `Make sure that cookie is written safely here.`;
exports.rule = {
    create(context) {
        let usingExpressFramework = false;
        return {
            Program() {
                // init flag for each file
                usingExpressFramework = false;
            },
            Literal(node) {
                if (node.value === "express") {
                    usingExpressFramework = true;
                }
            },
            AssignmentExpression(node) {
                const { left } = node;
                if (left.type === "MemberExpression") {
                    const { object, property } = left;
                    if (utils_1.isIdentifier(object, "document") && utils_1.isIdentifier(property, "cookie")) {
                        context.report({
                            message,
                            node: left,
                        });
                    }
                }
            },
            CallExpression(node) {
                const { callee, arguments: args } = node;
                if (callee.type === "MemberExpression" &&
                    usingExpressFramework &&
                    utils_1.isIdentifier(callee.property, "cookie", "cookies")) {
                    context.report({
                        message,
                        node,
                    });
                }
                if (callee.type === "MemberExpression" &&
                    utils_1.isIdentifier(callee.property, "setHeader") &&
                    isLiteral(args[0], "Set-Cookie")) {
                    context.report({
                        message,
                        node: callee,
                    });
                }
            },
        };
    },
};
function isLiteral(node, value) {
    return node && node.type === "Literal" && node.value === value;
}
//# sourceMappingURL=cookies.js.map