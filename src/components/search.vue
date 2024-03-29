<template>
  <n-form ref="formRef" :model="searchForm" label-placement="top">
    <n-grid cols="24" item-responsive responsive="screen">
      <n-form-item-gi span="12 m:6" label="Desporto" path="sport">
        <n-select v-model:value="searchForm.sport" placeholder="Deporto" :options="sports"
          @update:value="handleSport" />
      </n-form-item-gi>
      <n-form-item-gi span="11 m:6" offset="1 m:1" label="Cidade" path="city">
        <n-select v-model:value="searchForm.city" placeholder="Cidade" :options="cities" />
      </n-form-item-gi>
      <n-form-item-gi span="12 s:6 m:5" offset="m:1" label="Data" path="date">
        <n-date-picker v-model:formatted-value="searchForm.date" type="date" value-format="yyyy-MM-dd" :actions="null"
          input-readonly @update:value="saveConfig" />
      </n-form-item-gi>
      <n-form-item-gi span="11 s:5 m:4" offset="1 s:1 m:1" label="Hora Início" path="time">
        <n-time-picker v-model:formatted-value="searchForm.time" format="HH:mm" :minutes="30" :actions="null"
          input-readonly @update:value="saveConfig" />
      </n-form-item-gi>
      <n-form-item-gi span="12 s:7 m:6" offset="0 s:1 m:0" label="Duração" path="duration">
        <n-radio-group v-model:value="searchForm.duration" name="duration">
          <n-radio-button :value="60">
            1:00
          </n-radio-button>
          <n-radio-button :value="90">
            1:30
          </n-radio-button>
          <n-radio-button :value="120">
            2:00
          </n-radio-button>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi span="11 s:12 m:6" offset="1 s:0 m:1" label="Campos" path="sport">
        <n-select v-model:value="searchForm.courts" placeholder="Campos" :options="courtsSelection"
          @update:value="handleCourt" />
      </n-form-item-gi>
      <n-form-item-gi span="24 s:11 m:10" offset="0 s:1 m:1" label="Tipo" path="tipo">
        <!-- <n-form-item-gi span="19 s:8 m:7" offset="0 s:1 m:1" label="Tipo" path="tipo"> -->
        <n-space>
          <n-tag type="success" v-model:checked="searchForm.roof.noroof" checkable @click="saveConfig">
            Descoberto
          </n-tag>
          <n-tag v-model:checked="searchForm.roof.roof" checkable @click="saveConfig">
            Coberto
          </n-tag>
          <n-tag v-model:checked="searchForm.roof.indoor" checkable @click="saveConfig">
            Indoor
          </n-tag>
        </n-space>
      </n-form-item-gi>
      <!-- <n-form-item-gi span="4 s:4 m:2" offset="1 m:0" class="button-refresh">
        <n-button @click="goToLink">
          <template #icon>
            <n-icon :component="Refresh"></n-icon>
          </template>
        </n-button>
      </n-form-item-gi> -->
    </n-grid>
    <div style="display: flex; justify-content: flex-end">
      <n-button :loading="searchButtonLoading" strong secondary type="primary" icon-placement="right" @click="search">
        Pesquisar
        <template #icon>
          <n-icon :component="Search"></n-icon>
        </template>
      </n-button>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import { FormInst, NButton, NForm, NFormItemGi, NGrid, NSelect, NDatePicker, NTimePicker, NRadioGroup, NRadioButton, NTag, NSpace, NIcon, useMessage } from 'naive-ui';
import { Search } from '@vicons/ionicons5'
import { ref } from 'vue'
import { useGlobalStore } from '@/store/global';
import { useSearchStore } from '@/store/search';
import { useCourtStore } from '@/store/court';
import { storeToRefs } from 'pinia';
import { Sports } from '../models/sports';
import { useConfigStore } from '@/store/config';

const globalStore = useGlobalStore();
const searchStore = useSearchStore();
const courtStore = useCourtStore();
const configStore = useConfigStore();

const { searchButtonLoading } = storeToRefs(globalStore);
const { searchForm } = storeToRefs(searchStore);
const { courtsSelection } = storeToRefs(courtStore);

const { getCourts, setCourtsSelection } = courtStore;
const { searchConfig, saveConfig } = configStore;

const formRef = ref<FormInst | null>(null)
const message = useMessage();

const sports = [{ label: "Padel", value: 4 }, { label: "Futebol 5", value: 1 }, { label: "Futsal", value: 6 }, { label: "Tenis", value: 3 }];
const cities = [{ label: "Porto", value: 12 }];

const getCurrentDate = () => {
  const datetime = new Date();
  const offset = datetime.getTimezoneOffset();

  datetime.setTime(datetime.getTime() - (offset * 60 * 1000))
  if (datetime.getMinutes() < 30) {
    datetime.setMinutes(30);
  }
  else {
    datetime.setMinutes(0);
    datetime.setTime(datetime.getTime() + (60 * 60 * 1000));
  }

  const dateTemp = datetime.toISOString().split('T');
  const timeTemp = dateTemp[1].split(':');

  const date = dateTemp[0];
  const time = `${timeTemp[0]}:${timeTemp[1]}`;

  if (searchConfig.datetime) {
    if (searchForm.value.date < date || searchForm.value.time < time) {
      searchForm.value.date = date;
      searchForm.value.time = time;
    }
  }
  else {
    searchForm.value.date = date;
    searchForm.value.time = time;
  }

  saveConfig();
}

const handleSport = () => {
  setCourtsSelection();
  saveConfig();
}

const handleCourt = () => {
  switch (searchForm.value.sport) {
    case Sports.Padel:
      searchForm.value.duration = searchForm.value.courts === 2 ? 60 : 90;
      break;
  }
  saveConfig();
}

const search = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await getCourts();
      if (!res) {
        message.error('Não foi possível fazer o pedido.', { duration: 2000 });
      }
    }
    else {
      console.log(errors)
    }
  })
}

(async () => {
  getCurrentDate();
})()

</script>

<style lang="scss">
.button-refresh {
  justify-self: flex-end;
}
</style>
