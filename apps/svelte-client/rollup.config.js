const svelte = require('rollup-plugin-svelte');
const sveltePreprocess = require('svelte-preprocess');
const svelteSass = require('svelte-preprocess-sass');
const serve = require('rollup-plugin-serve-proxy');

module.exports = (config, options) => {
  const production = options.prod;
  const predefinedPluginsToExclude = ['svelte', 'serve'];

  config.output.globals = {
    svelte: 'svelte'
  };
  // console.log('options',options)
  // console.log('config.plugins',config.plugins)
  const svelteIndex = config.plugins.findIndex(plugin => plugin.name === 'svelte');
  const serveIndex = config.plugins.findIndex(plugin => plugin.name === 'serve');
  // const filteredPredefinedPlugins = config.plugins.filter(plugin => plugin && !predefinedPluginsToExclude.includes(plugin.name));
  // console.log('filteredPredefinedPlugins',filteredPredefinedPlugins)

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
    if (options.headers.length != 0) {
      serveOptions = Object.assign(Object.assign({}, serveOptions), {
        headers: Object.assign({}, ...options.headers.map(header => ({ [header.key]: header.value })))
      });
    }
    // console.log('rollup config serveOptions',serveOptions)
    myPlugins[serveIndex] = serve({ ...serveOptions });
    //   ...config.plugins.slice(0, serveIndex-1),
    //   serve({...serveOptions}),
    //   ...config.plugins.slice(serveIndex +1),
    // ]
    console.log('serve Plugins', myPlugins);
  }

  myPlugins[svelteIndex] = svelte({
    preprocess: sveltePreprocess({
      sourceMap: !production,
      sass: svelteSass.sass()
    }),
    compilerOptions: {
      dev: !production
    }
  });
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

  return {
    ...config,
    plugins: myPlugins
  };
};
