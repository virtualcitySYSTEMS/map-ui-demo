/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import commonViteConfig from './node_modules/@vcmap/ui/build/commonViteConfig.js';
import getPluginProxies from './node_modules/@vcmap/ui/build/getPluginProxies.js';
import { determineHostFromArgv } from './node_modules/@vcmap/ui/build/determineHost.js';

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
        '@vcmap/core',
        'ol',
        '@vcsuite/ui-components',
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
        ignored: ['!**/node_modules/@vcsuite/ui-components/**'],
      },
    },
  };
  delete config.resolve.alias['@vcmap/ui'];
  return config;
});

export default configMain;
