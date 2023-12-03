import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["api/check.js"],
  bundle: true,
  minify: true,
  outfile: "build/index.js",
  platform: "node",
  logLevel: "info"
});
