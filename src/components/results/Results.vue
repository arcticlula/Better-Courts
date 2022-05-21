<template>
  <n-grid cols="24" item-responsive responsive="screen" x-gap="8" y-gap="8">
    <n-gi span="24 m:12 l:8" v-for="court of courts">
      <result :court="court"></result>
    </n-gi>
  </n-grid>
  <n-modal v-model:show="showCourtModal" :bordered="true" preset="card" class="modal-card">
    <template #header>
      <h3>{{ currentCourt?.club_name }}</h3>
    </template>
    <div>
      <n-carousel>
        <img v-for="photo of currentCourt?.photos" class="carousel-img" :src="photo.path">
      </n-carousel>
      <div class="modal-court-name">{{ currentCourt?.court_name }}</div>
      <n-space class="modal-court-characteristics">
        <div>{{ currentCourt?.roof }}</div>
        ·
        <div>{{ currentCourt?.surface }}</div>
      </n-space>
      <div class="modal-court-date">{{ currentCourt?.date }}</div>
      <div class="modal-court-time">{{ currentCourt?.startTime }} -
        {{ currentCourt?.endTime }}</div>
      <!-- <div>{{ currentCourt?.address }}</div> -->
    </div>
    <template #footer>
      <n-space justify="end">
        <n-button tag="a" :href="getACLink()" target="_blank">
          <n-icon :component="Link"></n-icon>
        </n-button>
        <n-button tag="a" :href="'tel:' + currentCourt?.phone">
          <n-icon :component="Call"></n-icon>
        </n-button>
        <n-button tag="a" :href="getMapsLink()" target="_blank">
          <n-icon :component="Location"></n-icon>
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import Result from './Result.vue';
import { NModal, NButton, NCarousel, NSpace, NIcon, NGrid, NGi, NTag } from 'naive-ui';
import { Link, Call, Location } from '@vicons/ionicons5'
import { useCourtStore } from '@/store/court';
import { useGlobalStore } from '@/store/global';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore()
const courtStore = useCourtStore()

const { showCourtModal } = storeToRefs(globalStore);
const { courts, currentCourt } = storeToRefs(courtStore);

const getACLink = () => {
  const clubId = currentCourt.value?.club_id;
  const date = currentCourt.value?.date;
  let time = currentCourt.value?.startTime;
  time = time ? encodeURIComponent(time) : '';

  return `https://www.aircourts.com/index.php/site/view_club/${clubId}/${date}/${time}`;
}

const getMapsLink = () => {
  const lat = currentCourt.value?.lat;
  const lng = currentCourt.value?.lng;
  return `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
}

</script>

<style lang="scss">
.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.modal-court-name {
  margin-top: 8px;
  font-size: 15px;
}

.modal-court-characteristics {
  margin-top: 8px;
}

.modal-court-date {
  margin-top: 8px;
}

.modal-court-time {
  margin-top: 8px;
}

@media screen and (max-width: 700px) {
  .modal-card {
    width: 100%;
  }
}

@media screen and (min-width: 701px) and (max-width: 1023px) {
  .modal-card {
    width: 80%;
  }
}

@media screen and (min-width: 1024px) {
  .modal-card {
    width: 80vh;
  }
}
</style>
