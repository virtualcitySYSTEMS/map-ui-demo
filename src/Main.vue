<template>
  <v-app>
    <v-app-bar app>
      <v-card-text class="text-h2 w-full">
        Differing layouts
      </v-card-text>
      <template #extension>
        <v-tabs
          v-model="tab"
          align-with-title
        >
          <v-tabs-slider color="yellow" />

          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main app>
      <v-tabs-items v-model="tab" class="h-full">
        <v-tab-item class="flex-fill">
          <VcsApp :app-id="defaultAppId" v-if="defaultAppId" />
        </v-tab-item>
        <v-tab-item class="flex-fill">
          <MapOnly :app-id="mapOnlyId" v-if="mapOnlyId" />
        </v-tab-item>
        <v-tab-item>
          <v-sheet class="pa-4">
            <v-card class="pa-4">
              <h2>Further ideas:</h2>
              <v-list>
                <v-list-item>
                  Make a bottom bar instead of a navbar at the top.
                </v-list-item>
                <v-list-item>
                  Implement custom window manager
                </v-list-item>
              </v-list>
            </v-card>
          </v-sheet>
        </v-tab-item>
      </v-tabs-items>
      <v-dialog v-model="initDialog" :max-width="'40%'">
        <v-sheet class="pa-4">
          <v-card class="pa-4">
            <h1>Integration Demo</h1>
            This demo illustrates how the @vcmap/ui module can be used in different scenarios.
            You can switch through the tabs to see different layout ideas. <br>
            <VcsButton @click="initDialog = false">
              Go!
            </VcsButton>
          </v-card>
        </v-sheet>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
  import { VcsApp, VcsButton } from '@vcmap/ui';
  import { ref, getCurrentInstance } from '@vue/composition-api';
  import MapOnly from './MapOnly.vue';
  import { loadContext } from './helpers.js';

  export default {
    name: 'CustomMain',
    components: {
      VcsApp,
      VcsButton,
      MapOnly,
    },
    setup() {
      const defaultAppId = ref(null);
      const mapOnlyId = ref(null);

      const instance = getCurrentInstance().proxy;
      loadContext(defaultAppId, instance.$i18n);
      loadContext(mapOnlyId, instance.$i18n);

      return {
        initDialog: true,
        defaultAppId,
        mapOnlyId,
        tab: 0, // TODO use tab to load contexts only if needed
        items: ['default', 'map_only', 'ideas'],
      };
    },
  };
</script>

<style scoped>

</style>
