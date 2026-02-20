import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:3000/openapi.json",
  output: "./src/gen/api",
  plugins: [
    {
      name: "@hey-api/client-axios",
      runtimeConfigPath: "~/lib/api-client",
    },
    "@tanstack/react-query",
    "zod",
  ],
});
