import '@vcmap/ui/src/styles/main.scss';
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { i18n, VcsApp, VcsUiApp, vuetify } from '@vcmap/ui';
import {Context} from '@vcmap/core';


Vue.use(VueCompositionAPI);

const app = new VcsUiApp();
await new Vue({
  vuetify,
  i18n,
  render: h => h(VcsApp, {
    props: {
      appId: app.id,
    },
  }),
}).$mount('#app');

const config = await fetch('./node_modules/@vcmap/ui/config/base.config.json')
  .then(response => response.json());
const context = new Context(config);
await app.addContext(context);

