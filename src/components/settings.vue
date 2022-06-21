<template>
  <n-modal v-model:show="showSettingsModal" :bordered="true" preset="card" class="modal-card">
    <template #header>
      <h3>Definições</h3>
    </template>
    <div>
      <h3>Tema</h3>
      <n-radio-group v-model:value="thm" name="thm">
        <n-radio-button key="light" value="light" label="Light" />
        <n-radio-button key="dark" value="dark" label="Dark" />
        <n-radio-button key="os" value="os" label="Os" />
      </n-radio-group>
      <!-- <n-tabs type="segment" @update:value="handleUpdateValue">
        <n-tab-pane name="light" tab="Light">
          <n-icon :component="Search"></n-icon>
        </n-tab-pane>
        <n-tab-pane name="dark" tab="Dark">
          Hey Jude
        </n-tab-pane>
        <n-tab-pane name="os" tab="Os">
          Qilixiang
        </n-tab-pane>
      </n-tabs> -->
    </div>
    <template #footer>

    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { Search, Refresh } from '@vicons/ionicons5'
import { useGlobalStore } from '@/store/global';
import { NModal, NIcon, NRadioGroup, NRadioButton, NTabs, NTabPane } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const globalStore = useGlobalStore()
const { setTheme } = globalStore;
const { theme, showSettingsModal } = storeToRefs(globalStore);

let thm = computed({
  get: () => theme.value,
  set: (value) => setTheme(value)
})

const handleUpdateValue = (value: string) => {
  setTheme(value)
}

</script>

<style lang="scss">
.title {
  margin-bottom: 16px;
}
</style>
