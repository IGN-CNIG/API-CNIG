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
// https://jira.sonarsource.com/browse/RSPEC-4634
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.rule = {
    create(context) {
        return {
            NewExpression: (node) => {
                const executor = getPromiseExecutor(node, context);
                if (executor) {
                    checkExecutor(executor, node, context);
                }
            },
        };
    },
};
function getPromiseExecutor(node, context) {
    if (node.callee.type === "Identifier" &&
        context.getSourceCode().getText(node.callee) === "Promise" &&
        node.arguments.length === 1) {
        return node.arguments[0];
    }
    return undefined;
}
function checkExecutor(executor, node, context) {
    if (utils_1.isFunctionNode(executor)) {
        const { params, body } = executor;
        const [resolveParameterDeclaration, rejectParameterDeclaration] = params;
        const resolveParameterName = getParameterName(resolveParameterDeclaration);
        const rejectParameterName = getParameterName(rejectParameterDeclaration);
        const bodyExpression = getOnlyBodyExpression(body);
        if (bodyExpression && bodyExpression.type === "CallExpression") {
            const { callee, arguments: args } = bodyExpression;
            if (callee.type === "Identifier") {
                const action = getPromiseAction(callee.name, resolveParameterName, rejectParameterName);
                if (action && args.length === 1) {
                    context.report({
                        message: `Replace this trivial promise with "Promise.${action}(${context
                            .getSourceCode()
                            .getText(args[0])})".`,
                        node,
                    });
                }
            }
        }
    }
}
function getOnlyBodyExpression(node) {
    let bodyExpression;
    if (node.type === "BlockStatement") {
        if (node.body.length === 1) {
            const statement = node.body[0];
            if (statement.type === "ExpressionStatement") {
                bodyExpression = statement.expression;
            }
        }
    }
    else {
        bodyExpression = node;
    }
    return bodyExpression;
}
function getPromiseAction(callee, resolveParameterName, rejectParameterName) {
    switch (callee) {
        case resolveParameterName:
            return "resolve";
        case rejectParameterName:
            return "reject";
        default:
            return undefined;
    }
}
function getParameterName(node) {
    return node && node.type === "Identifier" ? node.name : undefined;
}
//# sourceMappingURL=prefer-promise-shorthand.js.map