import rollupOptions, {plugins, NAME} from "./rollup/rollup.config";
import {resolve} from "node:path";

//
import cssnano from "cssnano";
import deduplicate from "postcss-discard-duplicates";
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import tailWindNested from "tailwindcss/nesting";

//
export const __dirname = resolve(import.meta.dirname, "./");
export default {
    plugins,
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src/"),
            "@mods": resolve(__dirname, "./src/$lit$/"),
            "@scss": resolve(__dirname, "./src/$scss$/"),
            "@temp": resolve(__dirname, "./src/$temp$/"),
            "@service": resolve(__dirname, "./src/$service$/"),
            "/externals/": resolve(__dirname, "./externals/"),
            "/assets/": resolve(__dirname, "./assets/"),
            "/frontend/": resolve(__dirname, "./frontend/"),
            "/plugins/": resolve(__dirname, "./plugins/"),
        },
    },
    server: {
        port: 5173,
        open: false,
        origin: "http://localhost:5173",
    },
    build: {
        chunkSizeWarningLimit: 1600,
        assetsInlineLimit: 1024 * 1024,
        minify: "terser",
        sourcemap: 'hidden',
        target: "esnext",
        name: NAME,
        lib: {
            formats: ["es"],
            entry: resolve(__dirname, './src/main/index.ts'),
            name: NAME,
            fileName: NAME,
        },
        rollupOptions
    },
    optimizeDeps: {
        include: [
            "./node_modules/**/*.mjs",
            "./node_modules/**/*.js",
            "./node_modules/**/*.ts",
            "./src/**/*.mjs",
            "./src/**/*.js",
            "./src/**/*.ts",
            "./src/*.mjs",
            "./src/*.js",
            "./src/*.ts",
            "./test/*.mjs",
            "./test/*.js",
            "./test/*.ts"
        ],
        entries: [resolve(__dirname, './src/index.ts'),],
        force: true
    },
    css: {
        postcss: {
            plugins: [
                tailWindNested(),
                tailwindcss(),
                deduplicate(),
                autoprefixer(),
                cssnano({
                preset: ['advanced', {
                    calc: false,
                    discardComments: {
                        removeAll: true
                    }
                }],
            }), postcssPresetEnv({
                features: { 'nesting-rules': false },
                stage: 0
            })],
        },
    },
};
