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
// https://jira.sonarsource.com/browse/RSPEC-4817
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const xpathModule = "xpath";
const message = "Make sure that executing this XPATH expression is safe.";
const xpathEvalMethods = ["select", "select1", "evaluate"];
const ieEvalMethods = ["selectNodes", "SelectSingleNode"];
exports.rule = {
    create(context) {
        return {
            MemberExpression: (node) => {
                if (utils_1.isMemberExpression(node, "document", "evaluate")) {
                    context.report({ message, node });
                }
            },
            CallExpression: (node) => checkCallExpression(node, context),
        };
    },
};
function checkCallExpression({ callee, arguments: args }, context) {
    // IE
    if (utils_1.isMemberWithProperty(callee, ...ieEvalMethods) && args.length === 1) {
        context.report({ message, node: callee });
        return;
    }
    // Document.evaluate
    if (utils_1.isMemberWithProperty(callee, "evaluate") &&
        !utils_1.isMemberExpression(callee, "document", "evaluate") &&
        args.length >= 4) {
        const resultTypeArgument = args[3];
        const argumentAsText = context.getSourceCode().getText(resultTypeArgument);
        if (argumentAsText.includes("XPathResult")) {
            context.report({ message, node: callee });
            return;
        }
    }
    // "xpath" module
    const { moduleName, expression } = getModuleAndCalledMethod(callee, context);
    if (expression &&
        moduleName &&
        moduleName.value === xpathModule &&
        expression.type === "Identifier" &&
        xpathEvalMethods.includes(expression.name)) {
        context.report({ message, node: callee });
    }
}
function getModuleAndCalledMethod(callee, context) {
    let moduleName;
    let expression;
    if (callee.type === "MemberExpression" && callee.object.type === "Identifier") {
        moduleName = utils_1.getModuleNameOfIdentifier(callee.object, context);
        expression = callee.property;
    }
    if (callee.type === "Identifier") {
        moduleName = utils_1.getModuleNameOfImportedIdentifier(callee, context);
        expression = callee;
    }
    return { moduleName, expression };
}
//# sourceMappingURL=xpath.js.map