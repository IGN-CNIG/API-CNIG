"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const espree = require("espree");
const babel = require("babel-eslint");
const eslint_1 = require("eslint");
const VueJS = require("vue-eslint-parser");
// this value is taken from typescript-estree
// still we might consider extending this range
// if everything which we need is working on older/newer versions
const TYPESCRIPT_MINIMUM_VERSION = "3.2.1";
const TYPESCRIPT_MAXIMUM_VERSION = "3.8.0";
exports.PARSER_CONFIG_MODULE = {
    tokens: true,
    comment: true,
    loc: true,
    range: true,
    ecmaVersion: 2018,
    sourceType: "module",
    codeFrame: false,
    ecmaFeatures: {
        jsx: true,
        globalReturn: true,
    },
};
// 'script' source type forces not strict
exports.PARSER_CONFIG_SCRIPT = Object.assign(Object.assign({}, exports.PARSER_CONFIG_MODULE), { sourceType: "script" });
function parseJavaScriptSourceFile(fileContent) {
    let parseFunctions = [espree.parse, babel.parseForESLint];
    if (fileContent.includes("@flow")) {
        parseFunctions = [babel.parseForESLint];
    }
    let exceptionToReport = null;
    for (const parseFunction of parseFunctions) {
        for (const config of [exports.PARSER_CONFIG_MODULE, exports.PARSER_CONFIG_SCRIPT]) {
            const result = parse(parseFunction, config, fileContent);
            if (result instanceof eslint_1.SourceCode) {
                return result;
            }
            else if (!exceptionToReport) {
                exceptionToReport = result;
            }
        }
    }
    // if we reach this point, we are sure that "exceptionToReport" is defined
    return {
        line: exceptionToReport.lineNumber,
        message: exceptionToReport.message,
        code: ParseExceptionCode.Parsing,
    };
}
exports.parseJavaScriptSourceFile = parseJavaScriptSourceFile;
function parseTypeScriptSourceFile(fileContent, filePath, tsConfigs) {
    try {
        checkTypeScriptVersionCompatibility(require("typescript").version);
        // we load the typescript parser dynamically, so we don't need typescript dependency when analyzing pure JS project
        const tsParser = require("@typescript-eslint/parser");
        const result = tsParser.parseForESLint(fileContent, Object.assign(Object.assign({}, exports.PARSER_CONFIG_MODULE), { filePath: filePath, project: tsConfigs, loggerFn: console.log }));
        return new eslint_1.SourceCode(Object.assign(Object.assign({}, result), { parserServices: result.services, text: fileContent }));
    }
    catch (exception) {
        return {
            line: exception.lineNumber,
            message: exception.message,
            code: parseExceptionCodeOf(exception.message),
        };
    }
}
exports.parseTypeScriptSourceFile = parseTypeScriptSourceFile;
let reportedNewerTypeScriptVersion = false;
// exported for testing
function checkTypeScriptVersionCompatibility(currentVersion) {
    if (currentVersion >= TYPESCRIPT_MAXIMUM_VERSION && !reportedNewerTypeScriptVersion) {
        reportedNewerTypeScriptVersion = true;
        console.log(`WARN You are using version of TypeScript ${currentVersion} which is not officially supported; supported versions >=${TYPESCRIPT_MINIMUM_VERSION} <${TYPESCRIPT_MAXIMUM_VERSION}`);
    }
    else if (currentVersion < TYPESCRIPT_MINIMUM_VERSION) {
        throw {
            message: `You are using version of TypeScript ${currentVersion} which is not supported; supported versions >=${TYPESCRIPT_MINIMUM_VERSION}`,
        };
    }
}
exports.checkTypeScriptVersionCompatibility = checkTypeScriptVersionCompatibility;
function unloadTypeScriptEslint() {
    const tsParser = require("@typescript-eslint/parser");
    tsParser.clearCaches();
}
exports.unloadTypeScriptEslint = unloadTypeScriptEslint;
function parseVueSourceFile(fileContent) {
    let exceptionToReport = null;
    for (const config of [exports.PARSER_CONFIG_MODULE, exports.PARSER_CONFIG_SCRIPT]) {
        try {
            const result = VueJS.parseForESLint(fileContent, config);
            return new eslint_1.SourceCode(fileContent, result.ast);
        }
        catch (exception) {
            exceptionToReport = exception;
        }
    }
    // if we reach this point, we are sure that "exceptionToReport" is defined
    return {
        line: exceptionToReport.lineNumber,
        message: exceptionToReport.message,
        code: ParseExceptionCode.Parsing,
    };
}
exports.parseVueSourceFile = parseVueSourceFile;
function parse(parse, config, fileContent) {
    try {
        const result = parse(fileContent, config);
        if (result.ast) {
            return new eslint_1.SourceCode(Object.assign({ text: fileContent }, result));
        }
        else {
            return new eslint_1.SourceCode(fileContent, result);
        }
    }
    catch (exception) {
        return exception;
    }
}
exports.parse = parse;
var ParseExceptionCode;
(function (ParseExceptionCode) {
    ParseExceptionCode["Parsing"] = "PARSING";
    ParseExceptionCode["MissingTypeScript"] = "MISSING_TYPESCRIPT";
    ParseExceptionCode["UnsupportedTypeScript"] = "UNSUPPORTED_TYPESCRIPT";
    ParseExceptionCode["GeneralError"] = "GENERAL_ERROR";
})(ParseExceptionCode = exports.ParseExceptionCode || (exports.ParseExceptionCode = {}));
// exported for testing
function parseExceptionCodeOf(exceptionMsg) {
    if (exceptionMsg.startsWith("Cannot find module 'typescript'")) {
        return ParseExceptionCode.MissingTypeScript;
    }
    else if (exceptionMsg.startsWith("You are using version of TypeScript")) {
        return ParseExceptionCode.UnsupportedTypeScript;
    }
    else {
        return ParseExceptionCode.Parsing;
    }
}
exports.parseExceptionCodeOf = parseExceptionCodeOf;
//# sourceMappingURL=parser.js.map