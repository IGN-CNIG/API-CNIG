"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const analyzer_1 = require("./analyzer");
const parser_1 = require("./parser");
const tsconfig_1 = require("./tsconfig");
const MAX_REQUEST_SIZE = "50mb";
function start(port = 0) {
    return startServer(port, analyzer_1.analyzeJavaScript, analyzer_1.analyzeTypeScript);
}
exports.start = start;
// exported for test
function startServer(port = 0, analyzeJS, analyzeTS) {
    return new Promise(resolve => {
        console.log("DEBUG starting eslint-bridge server at port", port);
        let server;
        const app = express();
        // for parsing application/json requests
        app.use(bodyParser.json({ limit: MAX_REQUEST_SIZE }));
        app.post("/analyze-js", analyze(analyzeJS));
        app.post("/analyze-ts", analyze(analyzeTS));
        app.post("/new-tsconfig", (_request, response) => {
            parser_1.unloadTypeScriptEslint();
            response.send("OK!");
        });
        app.post("/tsconfig-files", (request, response) => {
            try {
                const tsconfig = request.body.tsconfig;
                response.json(tsconfig_1.getFilesForTsConfig(tsconfig));
            }
            catch (e) {
                console.error(e.stack);
                response.json({ error: e.message });
            }
        });
        app.get("/status", (_, resp) => resp.send("OK!"));
        app.post("/close", (_req, resp) => {
            console.log("DEBUG eslint-bridge server will shutdown");
            resp.end(() => {
                server.close();
            });
        });
        server = app.listen(port, () => {
            console.log("DEBUG eslint-bridge server is running at port", server.address().port);
            resolve(server);
        });
    });
}
exports.startServer = startServer;
function analyze(analysisFunction) {
    return (request, response) => {
        try {
            const parsedRequest = request.body;
            const analysisResponse = analysisFunction(parsedRequest);
            response.json(analysisResponse);
        }
        catch (e) {
            console.error(e.stack);
            response.json(Object.assign(Object.assign({}, analyzer_1.EMPTY_RESPONSE), { parsingError: {
                    message: e.message,
                    code: parser_1.ParseExceptionCode.GeneralError,
                } }));
        }
    };
}
//# sourceMappingURL=server.js.map