<template>
  <n-config-provider :theme="getTheme">
    <n-message-provider placement="top-right">
      <index />
      <settings />
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider, NGlobalStyle, NMessageProvider } from 'naive-ui';
import { storeToRefs } from 'pinia';
import index from './components/index.vue';
import settings from './components/settings.vue';
import { useConfigStore } from './store/config';

const configStore = useConfigStore()
const { getInitialConfig } = configStore;
const { getTheme } = storeToRefs(configStore);

(async () => {
  getInitialConfig();
})()

</script>

<style lang="scss">
#app {
  margin: 24px;
  margin-top: 35px;
}

@media screen and (max-width: 700px) {
  .modal-card {
    width: 100%;
  }
}

@media screen and (min-width: 701px) and (max-width: 1023px) {
  .modal-card {
    width: 80%;
  }
}

@media screen and (min-width: 1024px) {
  .modal-card {
    width: 80vh;
  }
}
</style>
