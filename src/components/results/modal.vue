<template>
  <n-modal v-model:show="showCourtModal" :bordered="true" preset="card" class="modal-card">
    <template #header>
      <n-space align="center" size="small">
        <h3>{{ currentCourt?.club_name }}</h3>
        <!-- <n-rate class="modal-court-rating" allow-half readonly :default-value="currentCourt?.rating" /> -->
      </n-space>
    </template>
    <div>
      <n-carousel>
        <img v-for="photo of currentCourt?.photos" class="carousel-img" :src="photo.path">
      </n-carousel>
      <n-divider>
        <div class="modal-court-name">{{ currentCourt?.court_name }}</div>
      </n-divider>
      <div class="modal-court-characteristics">
        <n-tag round type="info">{{ currentCourt?.roof }}</n-tag>
        <n-divider vertical />
        <n-tag round type="success">{{ currentCourt?.surface }}</n-tag>
      </div>
      <n-divider />
      <n-space justify="space-between">
        <n-tag>
          {{ currentCourt?.date }}
        </n-tag>
        <div>
          <n-tag>
            {{ currentCourt?.startTime }}
          </n-tag>
          <n-divider vertical />
          <n-tag>
            {{ currentCourt?.endTime }}
          </n-tag>
        </div>
      </n-space>
      <n-divider />
      <!-- <div>{{ currentCourt?.address }}</div> -->
    </div>
    <template #footer>
      <n-space justify="end">
        <n-button type="info" secondary tag="a" :href="getACLink()" target="_blank">
          Ver no Aircourts
          <template #icon>
            <n-icon :component="Link"></n-icon>
          </template>
        </n-button>
        <n-button type="success" secondary tag="a" :href="'tel:' + currentCourt?.phone">
          Ligar
          <template #icon>
            <n-icon :component="Call"></n-icon>
          </template>
        </n-button>
        <n-button type="warning" secondary tag="a" :href="getMapsLink()" target="_blank">
          <template #icon>
            <n-icon :component="Location"></n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useCourtStore } from '@/store/court';
import { useGlobalStore } from '@/store/global';
import { Call, Link, Location } from '@vicons/ionicons5';
import { NButton, NCarousel, NDivider, NIcon, NModal, NSpace, NTag } from 'naive-ui';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore()
const courtStore = useCourtStore()

const { showCourtModal } = storeToRefs(globalStore);
const { currentCourt } = storeToRefs(courtStore);

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
  return `geo:${lat},${lng}`;
  // return `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
}

</script>

<style lang="scss">
.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.modal-court-rating {
  display: flex;
  margin-left: 8px;
}

.modal-court-name {
  font-size: 15px;
}

.modal-court-characteristics {
  margin-bottom: 16px;
}
</style>
