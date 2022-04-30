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
    <n-global-style />
  </n-config-provider>
</template>

<script lang="ts" setup>
import { FormInst, NButton, NForm, NFormItemGi, NCollapse, NCollapseItem, NGrid, NSelect, NDatePicker, NTimePicker, NRadioGroup, NRadioButton, NTag, NSpace, NConfigProvider, GlobalTheme, darkTheme, NGlobalStyle, NGradientText, NIcon } from 'naive-ui';
import { Search, Refresh } from '@vicons/ionicons5'
import SearchCourts from './components/SearchCourts'
import Results from './components/Results'
import { ref } from "vue";
import { Court, UrbanSports, UrbanSportsAll } from './models/court';

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
