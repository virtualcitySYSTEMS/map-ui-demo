<template>
  <v-sheet>
    <v-card class="pa-2 z-index-2">
      <v-btn-toggle v-model="activeClassName">
        <VcsButton
          v-for="map in maps"
          :key="map.name"
        >
          {{ map.type }}
        </VcsButton>
      </v-btn-toggle>
      <v-divider class="mx-4" vertical />
      <VcsButton @click="showMapNav = !showMapNav" :active="showMapNav">
        Toggle Orientation Tools
      </VcsButton>
    </v-card>
    <VcsMap map-id="map-only-map" />
    <MapNavigation v-if="showMapNav" />
    <VcsWindowManager />
  </v-sheet>
</template>

<script>
  import { getVcsAppById } from '@vcmap/core';
  import { VcsMap, MapNavigation, VcsButton, VcsWindowManager } from '@vcmap/ui';
  import { ref, provide, computed, onMounted } from '@vue/composition-api';

  export default {
    name: 'MapOnly',
    props: {
      appId: {
        type: String,
        required: true,
      },
    },
    components: {
      VcsButton,
      VcsMap,
      MapNavigation,
      VcsWindowManager,
    },
    setup(props) {
      const app = getVcsAppById(props.appId);
      const activeMapId = ref(app.maps?.activeMap?.name);
      const showMapNav = ref(false);
      provide('vcsApp', app); // we need to provide this to ensure functionality of VcsMap, MapNavigation & VcsWindowManager components
      const maps = [...app.maps]
        .map(map => ({ type: map.className, name: map.name }));
      const activeClassName = computed({
        get() {
          if (activeMapId.value) {
            const map = app.maps.getByKey(activeMapId.value);
            return maps.findIndex(m => m.name === map.name);
          }
          return null;
        },
        set(index) {
          if (index != null) {
            const map = maps[index];
            app.maps.setActiveMap(map.name);
            activeMapId.value = map.name;
          }
        },
      });

      onMounted(() => {
        app.maps.setTarget('map-only-map');
      });

      return {
        activeMapId,
        activeClassName,
        maps,
        showMapNav,
      };
    },
  };
</script>

<style scoped>
</style>
