//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  compatibilityDate: "2025-07-01",
  externals: {
    external: ["@prisma/client"],
  },
});
