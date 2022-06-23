import { createVueI18n, vuetify, VcsAppWrapper } from '@vcmap/ui';
import Vue from 'vue';
import { ref } from '@vue/composition-api';
import { ButtonLocation } from '@vcmap/ui/src/manager/navbarManager.js';
import Main from './Main.vue';
import { loadContext } from './helpers.js';

async function loadCustom() {
  await new Vue({
    vuetify,
    i18n: createVueI18n(),
    render: h => h(Main),
  }).$mount('#app');
}

/**
 * Setup an app for the loadTwo function
 * @param {string} id
 * @returns {Promise<VcsUiApp>}
 */
async function setupApp(id) {
  const i18n = createVueI18n();
  const app = await loadContext(ref(null), i18n);

  const appContainer = document.createElement('div');
  appContainer.id = `${id}-container`;

  const appDiv = document.createElement('div');
  appDiv.id = id;
  appContainer.appendChild(appDiv);

  document.body.appendChild(appContainer);

  await new Vue({
    vuetify,
    i18n,
    render: h => h(VcsAppWrapper, {
      props: {
        appId: app.id,
      },
    }),
  }).$mount(`#${id}`);

  return app;
}

async function loadTwo() {
  const [, app2] = await Promise.all([setupApp('app1'), setupApp('app2')]);
  document.getElementById('app').style.display = 'none';

  let foo = 1;
  app2.navbarManager.add({
    id: 'Change Footer i18n',
    action: {
      name: 'Change Footer i18n',
      title: 'Change Footer i18n',
      callback() {
        const message = { footer: { title: `FOO ${foo}` } };
        app2.i18n.add({ en: message, de: message });
        foo += 1;
      },
    },
  }, 'testBoo', ButtonLocation.CONTENT);
}

(() => {
  const introductionText = document.createElement('p');
  introductionText.innerText = 'This demo illustrates different use cases for the @vcmap/ui package. You can either select an app which outlines multiple differing layouts or an app which illustrates how to load two applications with two separate vue instances and their own i18n plugin.';
  introductionText.id = 'loading-explanation';

  const b1 = document.createElement('button');
  b1.onclick = loadCustom;
  b1.innerText = 'Load Custom Application';
  b1.classList.add('loading-button');

  const b2 = document.createElement('button');
  b2.onclick = loadTwo;
  b2.innerText = 'Load Two Applications';
  b2.classList.add('loading-button');

  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button-container';
  buttonContainer.appendChild(introductionText);
  buttonContainer.appendChild(b1);
  buttonContainer.appendChild(b2);
  document.getElementById('app').appendChild(buttonContainer);

  const spinner = document.getElementById('loading-wrapper');
  spinner.parentElement.removeChild(spinner);
})();
