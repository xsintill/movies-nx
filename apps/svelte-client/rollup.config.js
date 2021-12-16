const svelte = require('rollup-plugin-svelte');
const sveltePreprocess = require('svelte-preprocess');
const svelteSass = require('svelte-preprocess-sass');
const serve = require('rollup-plugin-serve-proxy');
const buildable_libs_utils_1 = require("@nrwl/workspace/src/utilities/buildable-libs-utils");
const rollup_options_1 = require("@nxext/svelte/src/executors/utils/rollup-options");
const copy = require('rollup-plugin-copy');
const image = require('@rollup/plugin-image');
const typescript = require('@rollup/plugin-typescript');
const normalize_assets_1 = require("@nxext/svelte/src/executors/utils/normalize-assets");
const css = require('rollup-plugin-css-only');
const localResolve = require("rollup-plugin-local-resolve");
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const livereload = require('rollup-plugin-livereload');
const path = require("path");
const devkit_1 = require("@nrwl/devkit");

const fileExtensions = ['.js', '.ts', '.svelte'];

module.exports = (config, options) => {
  // console.log('extyernal', config.external)
  // console.log('deps', options.dependencies)
  // const production = options.prod;
  // const predefinedPluginsToExclude = ['svelte', 'serve'];
// delete config.plugins;
  // config.output.globals = {
  //   svelte: 'svelte'
  // };
  // // console.log('options',options)
  // // console.log('config.plugins',config.plugins)
  // const svelteIndex = config.plugins.findIndex(plugin => plugin.name === 'svelte');
  const serveIndex = config.plugins.findIndex(plugin => plugin.name === 'serve');
  // // const filteredPredefinedPlugins = config.plugins.filter(plugin => plugin && !predefinedPluginsToExclude.includes(plugin.name));
  // // console.log('filteredPredefinedPlugins',filteredPredefinedPlugins)

  let myPlugins = [...config.plugins];

  if (options.serve) {
    let serveOptions = {
      open: options.open,
      verbose: false,
      contentBase: options.outputPath,
      host: options.host,
      port: options.port,
      historyApiFallback: true,
      headers: {},
      //next line was added to provide a way to proxy
      proxy: options.proxy
    };
  // //   console.log('serveOptions', serveOptions)
    if (options.headers.length != 0) {
      serveOptions = Object.assign(Object.assign({}, serveOptions), {
        headers: Object.assign({}, ...options.headers.map(header => ({ [header.key]: header.value })))
      });
    }
  }
  // //   // console.log('rollup config serveOptions',serveOptions)
    // myPlugins[serveIndex] = serve({ ...serveOptions });
  //   myPlugins.push(serve({ ...serveOptions }));
  //   //   ...config.plugins.slice(0, serveIndex-1),
  //   //   serve({...serveOptions}),
  //   //   ...config.plugins.slice(serveIndex +1),
  //   // ]
  //   // console.log('serve Plugins', myPlugins);
  // }

  // myPlugins[svelteIndex] = svelte({
  //   preprocess: sveltePreprocess({
  //     sourceMap: !production,
  //     sass: svelteSass.sass()
  //   }),
  //   compilerOptions: {
  //     dev: !production
  //   }
  // });

  // console.log('serve Plugins', myPlugins);
  // myPlugins = [
  //   ...config.plugins.splice(0,svelteIndex-1),
  //   svelte({
  //     preprocess: sveltePreprocess({
  //       sourceMap: !production,
  //       sass: svelteSass.sass()
  //     }),
  //     compilerOptions: {
  //       dev: !production
  //     }
  //   }),
  //   ...config.plugins.splice(svelteIndex + 1)

  // ]
  // console.log('myPlugins', myPlugins)
  // console.log('options', options)



// const sveltePluginConfig = rollup_options_1.getSveltePluginConfig(null, options);
// const compilerOptionPaths = buildable_libs_utils_1.computeCompilerOptionsPaths(options.tsConfig, options.dependencies);
// let plugins = [
//   copy({
//     targets: normalize_assets_1.convertCopyAssetsToRollupOptions(options.outputPath, options.assets)
//   }),
//   image(),
//   typescript({
//     sourceMap: !options.prod,
//     tsconfig: options.tsConfig,
//     rootDir: options.projectRoot,
//     paths: compilerOptionPaths
//   }),
//   svelte({
//     preprocess: sveltePreprocess({
//       sourceMap: !production,
//       sass: svelteSass.sass()
//     }),
//     compilerOptions: {
//       dev: !production
//     }
//   }),
//   // we'll extract any component CSS out into
//   // a separate file - better for performance
//   css({
//     output: 'bundle.css'
//   }),
//   localResolve(),
//   plugin_node_resolve_1.default({
//     dedupe: ['svelte'],
//     preferBuiltins: true,
//     extensions: fileExtensions,
//   }),
//   commonjs(),
//   options.prod &&
//   terser({
//     output: {
//       comments: false,
//     },
//   }),
// ];
// if (options.serve) {
//   let serveOptions = {
//     open: options.open,
//     verbose: false,
//     contentBase: options.outputPath,
//     host: options.host,
//     port: options.port,
//     historyApiFallback: true,
//     headers: {},
//     proxy: options.proxy
//   };
//   if (options.headers.length != 0) {
//     serveOptions = Object.assign(Object.assign({}, serveOptions), {
//       headers: Object.assign({}, ...options.headers.map(header => ({
//         [header.key]: header.value
//       })))
//     });
//   }
//   plugins = [
//     ...plugins,
//     livereload(),
//     serve(serveOptions),
//   ];
// }
// // const externalPackages = dependencies
// //   .map((dependency) => dependency.name)
// //   .concat(options.external || []);
// const rollupConfig = {
//   input: options.entryFile,
//   output: {
//     format: 'iife',
//     file: path.join(options.outputPath, 'bundle.js'),
//     name: devkit_1.names(options.project).className,
//   },
//   external: config.external,
//   plugins,
// };
// console.log('rollupc', rollupConfig)
console.log('end result',{
  ...config,
  plugins: [...myPlugins]
})
  return {
    ...config,
    plugins: [...myPlugins]
  };
};
