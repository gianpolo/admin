import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import mkcert from 'vite-plugin-mkcert'
// https://vite.dev/config/
export default defineConfig({
    envPrefix: "REACT_APP_",
    server: {
        https: true,
        port: 4000,
    },
    plugins: [
        react(),
        mkcert(),
        svgr({
            svgrOptions: {
                icon: true,
                // This will transform your SVG to a React component
                exportType: "named",
                namedExport: "ReactComponent",
            },
        }),
    ],
});
