<template>
  <n-card :title="court?.club_name" embedded :bordered="false" @click="openModal()">
    <div class="court-result">
      <div class="court-image">
        <n-image object-fit="cover" :src="getPhoto(court?.court_id)" :height="90" :width="130" preview-disabled>
        </n-image>
      </div>
      <div class="court-name">{{ court?.court_name }}</div>
      <div class="court-roof">{{ court?.roof }}</div>
      <div class="court-time">{{ court?.startTime }} - {{ court?.endTime }}</div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import { NImage, NCard } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { toRefs } from 'vue';
import { CourtResult } from '../../models/court';
import { useCourtStore } from '../../store/court';
import { useGlobalStore } from '../../store/global';

const globalStore = useGlobalStore()
const courtStore = useCourtStore()
const { showCourtModal } = storeToRefs(globalStore);
const { currentCourt } = storeToRefs(courtStore);

const props = defineProps({
  court: {
    type: CourtResult,
    default: () => { }
  },
})

const { court } = toRefs(props);

const openModal = () => {
  currentCourt.value = court.value;
  showCourtModal.value = true;
}

const getPhoto = (courtId: number) => {
  return `https://www.aircourts.com/index.php/api/get_court_thumbnail/${courtId}`
}
</script>

<style lang="scss">
.n-card {
  cursor: pointer;

  &>.n-card-header {
    font-size: 14px;
  }
}

.court-result {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 0px;
}

.court-image {
  grid-area: 1 / 1 / 4 / 2;
}

.court-name {
  grid-area: 1 / 2 / 2 / 3;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.court-roof {
  grid-area: 2 / 2 / 3 / 3;
}

.court-time {
  grid-area: 3 / 2 / 4 / 3;
}
</style>
