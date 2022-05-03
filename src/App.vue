<template>
  <n-config-provider :theme="theme">
    <n-gradient-text class="title" :size="24" type="success">
      BetterCourts
    </n-gradient-text>
    <n-collapse display-directive="show" default-expanded-names="[1]" v-model:expanded-names="collapseState">
      <n-collapse-item title="Pesquisa" name="1">
        <search-courts v-model:collapseState="collapseState" v-model:courts="courts"></search-courts>
      </n-collapse-item>
      <n-collapse-item title="Resultados" name="2">
        <results v-model:courts="courts"></results>
      </n-collapse-item>
    </n-collapse>
    <n-back-top :right="100" :visibility-height="300" :style="{
      transition: 'all .3s cubic-bezier(.4, 0, .2, 1)'
    }">
      <n-icon :component="ArrowUp"></n-icon>
    </n-back-top>
    <n-global-style />
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NBackTop, NIcon, NCollapse, NCollapseItem, NConfigProvider, GlobalTheme, darkTheme, NGlobalStyle, NGradientText } from 'naive-ui';
import SearchCourts from './components/SearchCourts.vue'
import Results from './components/Results.vue'
import { ArrowUp } from '@vicons/ionicons5'
import { ref } from "vue";

const theme = ref<GlobalTheme | null>(darkTheme)

const collapseState = ref(["1"]);

const courts = ref([]);

(async () => {

})()

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
