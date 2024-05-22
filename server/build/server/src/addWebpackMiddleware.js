"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const webpack_config_js_1 = __importDefault(require("../../webpack.config.js"));
function addWebpackMiddleware(app) {
    var _a;
    const webpackConfigForMiddleware = Object.assign(Object.assign({}, webpack_config_js_1.default), { mode: 'development', plugins: [new webpack_1.default.HotModuleReplacementPlugin()] });
    if (typeof webpackConfigForMiddleware.entry === 'string') {
        webpackConfigForMiddleware.entry = [
            'webpack-hot-middleware/client?reload=true',
            webpackConfigForMiddleware.entry, // notre fichier client/src/main.js
        ];
    }
    const compiler = (0, webpack_1.default)(webpackConfigForMiddleware);
    // activation des 2 middlewares nécessaires au live-reload :
    app.use((0, webpack_dev_middleware_1.default)(compiler, {
        publicPath: (_a = webpack_config_js_1.default.output) === null || _a === void 0 ? void 0 : _a.publicPath,
    }));
    app.use((0, webpack_hot_middleware_1.default)(compiler));
}
exports.default = addWebpackMiddleware;
//# sourceMappingURL=addWebpackMiddleware.js.map