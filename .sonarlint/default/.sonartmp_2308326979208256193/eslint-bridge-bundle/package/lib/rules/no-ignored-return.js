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
// https://jira.sonarsource.com/browse/RSPEC-2201
Object.defineProperty(exports, "__esModule", { value: true });
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
const METHODS_WITHOUT_SIDE_EFFECTS = {
    array: new Set([
        "concat",
        "includes",
        "join",
        "slice",
        "indexOf",
        "lastIndexOf",
        "entries",
        "every",
        "some",
        "filter",
        "findIndex",
        "keys",
        "map",
        "values",
        "find",
        "reduce",
        "reduceRight",
        "toString",
        "toLocaleString",
    ]),
    date: new Set([
        "getDate",
        "getDay",
        "getFullYear",
        "getHours",
        "getMilliseconds",
        "getMinutes",
        "getMonth",
        "getSeconds",
        "getTime",
        "getTimezoneOffset",
        "getUTCDate",
        "getUTCDay",
        "getUTCFullYear",
        "getUTCHours",
        "getUTCMilliseconds",
        "getUTCMinutes",
        "getUTCMonth",
        "getUTCSeconds",
        "getYear",
        "toDateString",
        "toISOString",
        "toJSON",
        "toGMTString",
        "toLocaleDateString",
        "toLocaleTimeString",
        "toTimeString",
        "toUTCString",
        "toString",
        "toLocaleString",
    ]),
    math: new Set([
        "abs",
        "E",
        "LN2",
        "LN10",
        "LOG2E",
        "LOG10E",
        "PI",
        "SQRT1_2",
        "SQRT2",
        "abs",
        "acos",
        "acosh",
        "asin",
        "asinh",
        "atan",
        "atanh",
        "atan2",
        "cbrt",
        "ceil",
        "clz32",
        "cos",
        "cosh",
        "exp",
        "expm1",
        "floor",
        "fround",
        "hypot",
        "imul",
        "log",
        "log1p",
        "log10",
        "log2",
        "max",
        "min",
        "pow",
        "random",
        "round",
        "sign",
        "sin",
        "sinh",
        "sqrt",
        "tan",
        "tanh",
        "trunc",
    ]),
    number: new Set(["toExponential", "toFixed", "toPrecision", "toLocaleString", "toString"]),
    regexp: new Set(["test", "toString"]),
    string: new Set([
        "charAt",
        "charCodeAt",
        "codePointAt",
        "concat",
        "includes",
        "endsWith",
        "indexOf",
        "lastIndexOf",
        "localeCompare",
        "match",
        "normalize",
        "padEnd",
        "padStart",
        "repeat",
        "replace",
        "search",
        "slice",
        "split",
        "startsWith",
        "substr",
        "substring",
        "toLocaleLowerCase",
        "toLocaleUpperCase",
        "toLowerCase",
        "toUpperCase",
        "trim",
        "length",
        "toString",
        "valueOf",
        // HTML wrapper methods
        "anchor",
        "big",
        "blink",
        "bold",
        "fixed",
        "fontcolor",
        "fontsize",
        "italics",
        "link",
        "small",
        "strike",
        "sub",
        "sup",
    ]),
};
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (isRequiredParserServices_1.isRequiredParserServices(services)) {
            return {
                CallExpression: (node) => {
                    const call = node;
                    const callee = call.callee;
                    if (callee.type === "MemberExpression") {
                        const parent = nodes_1.getParent(context);
                        if (parent && parent.type === "ExpressionStatement") {
                            const methodName = context.getSourceCode().getText(callee.property);
                            const objectType = services.program
                                .getTypeChecker()
                                .getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(callee.object));
                            if (!hasSideEffect(methodName, objectType, services) &&
                                !isReplaceWithCallback(methodName, call.arguments)) {
                                context.report({
                                    message: message(methodName),
                                    node,
                                });
                            }
                        }
                    }
                },
            };
        }
        return {};
    },
};
function message(methodName) {
    if (methodName === "map") {
        return `Consider using "forEach" instead of "map" as its return value is not being used here.`;
    }
    else {
        return `The return value of "${methodName}" must be used.`;
    }
}
function hasSideEffect(methodName, objectType, services) {
    const typeAsString = typeToString(objectType, services);
    if (typeAsString !== null) {
        const methods = METHODS_WITHOUT_SIDE_EFFECTS[typeAsString];
        return !(methods && methods.has(methodName));
    }
    return true;
}
function typeToString(tp, services) {
    const typechecker = services.program.getTypeChecker();
    const baseType = typechecker.getBaseTypeOfLiteralType(tp);
    const typeAsString = typechecker.typeToString(baseType);
    if (typeAsString === "number" || typeAsString === "string") {
        return typeAsString;
    }
    const symbol = tp.getSymbol();
    if (symbol) {
        const name = symbol.getName();
        switch (name) {
            case "Array":
            case "Date":
            case "Math":
            case "RegExp":
                return name.toLowerCase();
        }
    }
    return null;
}
function isReplaceWithCallback(methodName, callArguments) {
    if (methodName === "replace" && callArguments.length > 1) {
        return ["FunctionExpression", "ArrowFunctionExpression"].includes(callArguments[1].type);
    }
    return false;
}
//# sourceMappingURL=no-ignored-return.js.map