import { Context } from '@vcmap/core';
import { setupI18n, VcsUiApp } from '@vcmap/ui';

/**
 * @param {Ref<string>} idRef
 * @param {VueI18nPlugin} i18n
 * @returns {Promise<VcsUiApp>}
 */
// eslint-disable-next-line import/prefer-default-export
export async function loadContext(idRef, i18n) {
  const app = new VcsUiApp();
  idRef.value = app.id;

  const config = await fetch('./node_modules/@vcmap/ui/config/base.config.json')
    .then(response => response.json());
  config?.plugins?.forEach((p) => {
    if (p?.entry?.startsWith('plugins/')) {
      p.entry = `node_modules/@vcmap/ui/${p.entry}`;
    }
  });
  const context = new Context(config);
  setupI18n(app, i18n);
  await app.addContext(context);
  return app;
}
