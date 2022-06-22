<template>
  <n-space justify="space-between" align="center">
    <n-gradient-text :size="24" type="success">
      BetterCourts
    </n-gradient-text>
    <n-button secondary circle type="primary" @click="openModal()">
      <template #icon>
        <n-icon :component="SettingsSharp"></n-icon>
      </template>
    </n-button>
  </n-space>
  <n-collapse class="mt-16" display-directive="show" v-model:expanded-names="collapseState">
    <n-collapse-item title="Pesquisa" name="1">
      <search></search>
    </n-collapse-item>
    <n-collapse-item title="Resultados" name="2">
      <results></results>
    </n-collapse-item>
  </n-collapse>
  <n-back-top :right="100" :visibility-height="300" :style="{
    transition: 'all .3s cubic-bezier(.4, 0, .2, 1)'
  }">
    <n-icon :component="ArrowUp"></n-icon>
  </n-back-top>
</template>

<script lang="ts" setup>
import { ArrowUp, SettingsSharp } from '@vicons/ionicons5';
import { NBackTop, NCollapse, NCollapseItem, NGradientText, NIcon, NSpace, NButton } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global';
import Results from './results/results.vue';
import Search from './search.vue';

const globalStore = useGlobalStore()
const { collapseState, showSettingsModal } = storeToRefs(globalStore);

const openModal = () => {
  showSettingsModal.value = true;
}

</script>

<style lang="scss">
.mt-16 {
  margin-top: 16px;
}
</style>
