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
// https://jira.sonarsource.com/browse/RSPEC-1481
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = {
    create(context) {
        let toIgnore = [];
        function checkVariable(v, toCheck) {
            if (v.defs.length === 0) {
                return;
            }
            const type = v.defs[0].type;
            if (type !== "Variable" && type !== "FunctionName") {
                return;
            }
            if (toCheck === "let-const-function") {
                const def = v.defs[0];
                if (def.parent && def.parent.type === "VariableDeclaration" && def.parent.kind === "var") {
                    return;
                }
            }
            const defs = v.defs.map(def => def.name);
            const unused = v.references.every(ref => defs.includes(ref.identifier));
            if (unused && !toIgnore.includes(defs[0])) {
                const message = getMessage(v.name, type === "FunctionName");
                defs.forEach(def => context.report({
                    node: def,
                    message,
                }));
            }
        }
        function checkScope(scope, checkedInParent) {
            let toCheck = checkedInParent;
            if (scope.type === "function") {
                toCheck = "all";
            }
            else if (checkedInParent === "nothing" && scope.type === "block") {
                toCheck = "let-const-function";
            }
            if (toCheck !== "nothing" && scope.type !== "function-expression-name") {
                scope.variables.forEach(v => checkVariable(v, toCheck));
            }
            scope.childScopes.forEach(childScope => checkScope(childScope, toCheck));
        }
        return {
            ObjectPattern: (node) => {
                const elements = node.properties;
                const hasRest = elements.some(element => element.type === "RestElement");
                if (!hasRest) {
                    return;
                }
                elements.forEach(element => {
                    if (element.type === "Property" &&
                        element.shorthand &&
                        element.value.type === "Identifier") {
                        toIgnore.push(element.value);
                    }
                });
            },
            "Program:exit": () => {
                checkScope(context.getScope(), "nothing");
                toIgnore = [];
            },
        };
    },
};
function getMessage(name, isFunction) {
    if (isFunction) {
        return `Remove unused function '${name}'.`;
    }
    else {
        return `Remove the declaration of the unused '${name}' variable.`;
    }
}
//# sourceMappingURL=sonar-no-unused-vars.js.map