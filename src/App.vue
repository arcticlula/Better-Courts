<template>
  <n-config-provider :theme="theme">
    <n-message-provider placement="top-right">
      <n-gradient-text class="title" :size="24" type="success">
        BetterCourts
      </n-gradient-text>
      <n-collapse display-directive="show" v-model:expanded-names="collapseState">
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
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NBackTop, NIcon, NCollapse, NCollapseItem, NConfigProvider, GlobalTheme, darkTheme, NGlobalStyle, NGradientText, NMessageProvider } from 'naive-ui';
import Search from './components/Search.vue'
import Results from './components/results/Results.vue'
import { ArrowUp } from '@vicons/ionicons5'
import { ref } from "vue";
import { useGlobalStore } from './store/global';
import { storeToRefs } from 'pinia';

const theme = ref<GlobalTheme | null>(darkTheme)

const globalStore = useGlobalStore()
const { collapseState } = storeToRefs(globalStore);

</script>

<style lang="scss">
#app {
  margin: 24px;
  margin-top: 35px;
}

.title {
  margin-bottom: 16px;
}
</style>
