<template>
  <!-- <pre>{{ JSON.stringify(courts, null, 2) }}</pre> -->
  <div v-for="court of courts" style="margin-bottom: 8px;">
    <n-card :title="court.club_name" embedded :bordered="false" @click="openModal(court)">
      <div class="court-result">
        <div class="court-image">
          <n-image object-fit="cover" :src="getPhoto(court)" :height="90" :width="130" preview-disabled></n-image>
        </div>
        <div class="court-name">{{ court.court_name }}</div>
        <div class="court-roof">{{ court.roof }}</div>
        <div class="court-time">{{ court.startTime }} - {{ court.endTime }}</div>
      </div>
    </n-card>
  </div>
  <n-modal v-model:show="showModal" :bordered="true" preset="card">
    <!-- <n-card :bordered="false" size="huge" role="dialog" aria-modal="true"> -->
    <template #header>
      <h3>{{ currentCourt?.club_name }}</h3>
    </template>
    <div>
      <h4>
        <n-space><span>{{ currentCourt?.court_name }}</span> <span>({{ currentCourt?.startTime }} -
            {{ currentCourt?.endTime }})</span></n-space>
      </h4>
      <n-carousel>
        <img v-for="photo of currentCourt?.photos" class="carousel-img" :src="photo.path">
      </n-carousel>
      <h4>{{ currentCourt?.roof }}</h4>
      <h4>{{ currentCourt?.address }}</h4>
    </div>
    <template #footer>
      <n-space justify="end">
        <n-button tag="a" :href="'tel:' + currentCourt?.phone">
          <n-icon :component="Call"></n-icon>
        </n-button>
        <n-button tag="a" :href="getMapsLink()" target="_blank">
          <n-icon :component="Location"></n-icon>
        </n-button>
      </n-space>
    </template>
    <!-- </n-card> -->
  </n-modal>
</template>

<script lang="ts" setup>
import { NImage, NModal, NCard, NButton, NCarousel, NSpace, NIcon } from 'naive-ui';
import { Call, Location } from '@vicons/ionicons5'
import { PropType, ref } from "vue";
// import { useMobileDetection } from "vue3-mobile-detection";
import { CourtResult } from '@/models/court';

const props = defineProps({
  courts: {
    type: Array as PropType<Array<CourtResult>>,
    default: () => []
  },
})

const showModal = ref(false);
// const { isMobile } = useMobileDetection();
const currentCourt = ref<CourtResult | null>(null);

const openModal = (court: CourtResult) => {
  currentCourt.value = court;
  console.log(currentCourt)
  showModal.value = true;
}

const getPhoto = (court: CourtResult) => {
  return `https://www.aircourts.com/index.php/api/get_court_thumbnail/${court.court_id}`
}

const getMapsLink = () => {
  const lat = currentCourt.value?.lat;
  const lng = currentCourt.value?.lng;
  return `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
}

</script>

<style lang="scss">
.n-card>.n-card-header {
  font-size: 14px;
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

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>
