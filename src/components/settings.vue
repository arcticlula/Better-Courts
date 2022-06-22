<template>
  <n-modal v-model:show="showSettingsModal" :bordered="true" preset="card" class="modal-card">
    <template #header>
      <h3>Definições</h3>
    </template>
    <div>
      <h4 class="modal-settings-theme">Tema</h4>
      <n-tabs v-model:value="theme" type="segment" @update:value="saveConfig">
        <n-tab name="light" tab="Dia">
          <span class="mr-8">
            Dia
          </span>
          <n-icon :component="SunnyOutline"></n-icon>
        </n-tab>
        <n-tab name="dark" tab="Noite">
          <span class="mr-8">
            Noite
          </span>
          <n-icon :component="MoonOutline"></n-icon>
        </n-tab>
        <n-tab name="os" tab="Sistema">
          <span class="mr-8">
            Sistema
          </span>
          <n-icon :component="SettingsOutline"></n-icon>
        </n-tab>
      </n-tabs>
      <h4>Pesquisa</h4>
      <n-space>
        <n-switch v-model:value="searchConfig.sport" :round="false" @update:value="updateCourtConfig" />
        <span>Guardar último desporto selecionado.</span>
      </n-space>
      <n-space class="ml-16">
        <n-switch v-model:value="searchConfig.court" :disabled="!searchConfig.sport" :round="false"
          @update:value="saveConfig" />
        <span>Guardar último campo selecionado.</span>
      </n-space>
      <n-space class="mt-16">
        <n-switch v-model:value="searchConfig.datetime" :round="false" @update:value="saveConfig" />
        <span>Guardar última data e hora selecionada.</span>
      </n-space>
      <n-space>
        <n-switch v-model:value="searchConfig.roof" :round="false" @update:value="saveConfig" />
        <span>Guardar último tipo de coberto selecionado.</span>
      </n-space>
    </div>
    <template #footer>

    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { SunnyOutline, MoonOutline, SettingsOutline } from '@vicons/ionicons5'
import { useGlobalStore } from '@/store/global';
import { NModal, NIcon, NTabs, NTab, NSpace, NSwitch } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/store/config';

const globalStore = useGlobalStore()
const configStore = useConfigStore()
const { saveConfig } = configStore;
const { showSettingsModal } = storeToRefs(globalStore);
const { theme, searchConfig } = storeToRefs(configStore);

const updateCourtConfig = (value: boolean) => {
  if (!value) {
    searchConfig.value.court = false;
  }
  saveConfig();
}

</script>

<style lang="scss">
.modal-settings-theme {
  margin-top: 0;
}

.mr-8 {
  margin-right: 8px;
}

.mt-16 {
  margin-top: 16px !important;
}

.ml-16 {
  margin-left: 16px;
}
</style>
