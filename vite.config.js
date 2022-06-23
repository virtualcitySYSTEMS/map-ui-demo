/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import commonViteConfig from '@vcmap/ui/build/commonViteConfig.js';
import getPluginProxies from '@vcmap/ui/build/getPluginProxies.js';
import { determineHostFromArgv } from '@vcmap/ui/build/determineHost.js';

const configMain = defineConfig(async ({ mode }) => {
  const production = mode === 'production';
  const https = false;
  const port = production ? 4173 : 8080;
  let proxy = {};
  if (!production) {
    const host = determineHostFromArgv(port, https);
    proxy = await getPluginProxies(host, production);
  }

  const config = {
    ...commonViteConfig,
    optimizeDeps: {
      exclude: [
        '@vcmap/ui',
        '@vcmap/core',
        'ol',
        'vue',
      ],
      include: [
        '@vcmap/core > fast-deep-equal',
        '@vcmap/core > rbush-knn',
        '@vcmap/core > rbush-knn > tinyqueue',
        '@vcmap/core > pbf',
        'ol > pbf',
        '@vcmap/cesium',
      ],
    },
    server: {
      https,
      strictPort: true,
      port,
      proxy,
      watch: {
        ignored: ['!**/node_modules/@vcmap/ui/**'],
      },
    },
  };
  delete config.resolve.alias['@vcmap/ui'];
  config.css.preprocessorOptions.sass.additionalData = "\n@import 'node_modules/@vcmap/ui/src/styles/variables.scss'\n";
  return config;
});

export default configMain;
