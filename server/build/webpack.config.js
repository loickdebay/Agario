"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = {
    // Fichier d'entrée :
    entry: './client/src/main.ts',
    // Fichier de sortie :
    output: {
        path: path_1.default.resolve(process.cwd(), './client/public/build'),
        filename: 'main.bundle.js',
        publicPath: '/build/',
    },
    // compatibilité anciens navigateurs (si besoin du support de IE11 ou android 4.4)
    target: ['web', 'es5'],
    // connexion webpack <-> babel :
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                use: {
                    // ... seront compilés par tsc !
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.client.json',
                    },
                },
            },
        ],
    },
    resolve: {
        // Ajoute le support de l'extension `.ts`
        extensions: ['.ts', '.js'],
    },
    devtool: 'source-map',
    devServer: {
        hot: false,
        static: {
            directory: './client/public',
            watch: {
                // optimisation live-reload
                ignored: 'node_modules',
            },
        },
        port: 8000,
        historyApiFallback: true, // gestion deeplinking
    },
};
//# sourceMappingURL=webpack.config.js.map