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
// https://jira.sonarsource.com/browse/RSPEC-117
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.rule = {
    create(context) {
        return {
            VariableDeclaration: (node) => checkVariable(node, context),
            "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction, TSMethodSignature, TSConstructSignatureDeclaration, TSEmptyBodyFunctionExpression": (node) => checkFunction(node, context),
            ClassProperty: (node) => checkProperty(node, context),
            CatchClause: (node) => checkCatch(node, context),
        };
    },
};
function checkVariable(decl, context) {
    if (decl.declare) {
        return;
    }
    decl.declarations.forEach(declaration => utils_1.resolveIdentifiers(declaration.id).forEach(id => raiseOnInvalidIdentifier(id, "local variable", context)));
}
function checkFunction(func, context) {
    if (func.declare) {
        return;
    }
    func.params.forEach(param => utils_1.resolveIdentifiers(param).forEach(id => raiseOnInvalidIdentifier(id, "parameter", context)));
}
function checkProperty(prop, context) {
    if (prop.key.type === "Identifier") {
        raiseOnInvalidIdentifier(prop.key, "property", context);
    }
}
function checkCatch(catchh, context) {
    if (catchh.param) {
        utils_1.resolveIdentifiers(catchh.param).forEach(id => raiseOnInvalidIdentifier(id, "parameter", context));
    }
}
function raiseOnInvalidIdentifier(id, idType, context) {
    const [{ format }] = context.options;
    const { name } = id;
    if (!name.match(format)) {
        context.report({
            message: `Rename this ${idType} "${name}" to match the regular expression ${format}.`,
            node: id,
        });
    }
}
//# sourceMappingURL=variable-name.js.map