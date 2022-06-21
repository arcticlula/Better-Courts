<template>
  <n-grid cols="24" item-responsive responsive="screen" x-gap="8" y-gap="8">
    <n-gi span="24 m:12 l:8" v-for="court of courts">
      <result :court="court"></result>
    </n-gi>
  </n-grid>
  <modal>
  </modal>
</template>

<script lang="ts" setup>
import result from './result.vue';
import modal from './modal.vue';
import { NGrid, NGi } from 'naive-ui';
import { useCourtStore } from '@/store/court';
import { storeToRefs } from 'pinia';

const courtStore = useCourtStore()
const { courts } = storeToRefs(courtStore);

</script>

<style lang="scss">
</style>
