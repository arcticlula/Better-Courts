<template>
  <pre>{{ JSON.stringify(courts, null, 2) }}</pre>
</template>

<script lang="ts" setup>
import { FormInst, NButton, NForm, NFormItemGi, NGrid, NSelect, NDatePicker, NTimePicker, NRadioGroup, NRadioButton, NTag, NSpace, NConfigProvider, GlobalTheme, darkTheme, NGlobalStyle, NGradientText, NIcon } from 'naive-ui';
import { Search, Refresh } from '@vicons/ionicons5'
import { ref } from "vue";

const props = defineProps({
    courts: {
        type: Array,
        default: []
    },
})

</script>

<style lang="scss">

</style>
