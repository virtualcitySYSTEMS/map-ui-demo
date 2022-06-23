import path from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { build } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import vcsOl from '@vcmap/rollup-plugin-vcs-ol';
import { libraries, buildPluginsForPreview } from '@vcmap/ui/build/buildHelpers.js';
import commonViteConfig from '@vcmap/ui/build/commonViteConfig.js';

/**
 * Returns an object to be used as externals. Assets are copied from @vcmap/ui to the assets folder. This ensures perfect integration with plugins etc.
 * @returns {Object<string, string>}
 */
function getLibraryPaths() {
  const libraryPaths = {};
  Object.entries(libraries).forEach(([library, assetName]) => {
    libraryPaths[library] = `./${assetName}.js`;
  });
  return libraryPaths;
}

/**
 * @returns {Promise<void>}
 */
async function buildModule() {
  const libraryPaths = getLibraryPaths();
  const distPath = path.join(process.cwd(), 'dist');
  await fs.rm(distPath, { recursive: true, force: true });
  await fs.mkdir(distPath);

  const external = Object.keys(libraryPaths);

  const commonConfig = { ...commonViteConfig };
  delete commonConfig.resolve.alias['@vcmap/ui'];
  commonConfig.plugins.push(
    vcsOl(), // create ol namespace so we can use the ol.js asset
    {
      transform(source, sid) {
        if (/helpers.js/.test(sid)) {
          return source.replace('./node_modules/@vcmap/ui/config/base.config.json', 'config.json'); // config will be moved here in build step
        }
        return source;
      },
    },
  );

  execSync('npm run install-plugins', { cwd: 'node_modules/@vcmap/ui' });
  await buildPluginsForPreview({
    configFile: false,
    ...commonConfig,
  }); // build plugins
  await build({
    configFile: false,
    ...commonConfig,
    esbuild: {
      minify: true,
    },
    base: './',
    build: {
      emptyOutDir: false,
      rollupOptions: {
        external,
        output: {
          paths: libraryPaths,
        },
      },
    },
  });

  const distConfig = path.join(distPath, 'config.json');
  await Promise.all([
    fs.cp('node_modules/@vcmap/ui/dist/assets', path.join(distPath, 'assets'), { recursive: true }), // we require assets, since we defined them as external
    fs.cp('node_modules/@vcmap/ui/config/base.config.json', distConfig), // we require the config
  ]);

  const configContent = await fs.readFile(distConfig);
  await fs.writeFile(distConfig, configContent.toString().replace(/"entry":\s"plugin/g, '"entry": "./plugin'));
}

await buildModule();
