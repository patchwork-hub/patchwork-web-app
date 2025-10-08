import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "src/tests/setup.ts",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/"),
        },
    },
});
