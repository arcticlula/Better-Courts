<template>
  <n-form ref="formRef" :model="model" label-placement="top">
    <n-grid cols="24" item-responsive responsive="screen">
      <n-form-item-gi span="12" label="Desporto" path="sport">
        <n-select v-model:value="model.sport" placeholder="Deporto" :options="sports" @update:value="handleSport" />
      </n-form-item-gi>
      <n-form-item-gi span="11" offset="1" label="Cidade" path="city">
        <n-select v-model:value="model.city" placeholder="Cidade" :options="cities" />
      </n-form-item-gi>
      <n-form-item-gi span="10 s:11" label="Data" path="date">
        <n-date-picker v-model:formatted-value="model.date" type="date" value-format="yyyy-MM-dd" :actions="null"
          input-readonly />
      </n-form-item-gi>
      <n-form-item-gi span="8 s:8" offset="1 s:1" label="Hora Início" path="time">
        <n-time-picker v-model:formatted-value="model.time" format="HH:mm" :minutes="30" :actions="null"
          input-readonly />
      </n-form-item-gi>
      <n-form-item-gi span="4 s:3" offset="1 s:1" class="button-refresh">
        <n-button @click="getCurrentDate">
          <template #icon>
            <n-icon :component="Refresh"></n-icon>
          </template>
        </n-button>
      </n-form-item-gi>
      <n-form-item-gi span="12 m:7" label="Duração" path="duration">
        <n-radio-group size="small" v-model:value="model.duration" name="duration">
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
      <n-form-item-gi span="11 m:4" offset="1" label="Campos" path="sport">
        <n-select v-model:value="model.courts" placeholder="Campos" :options="courtsSel" />
      </n-form-item-gi>
      <n-form-item-gi span="19 m:11" offset="0 s:1 m:1" label="Tipo" path="tipo">
        <n-space>
          <n-tag type="success" v-model:checked="model.roof.noroof" checkable>
            Descoberto
          </n-tag>
          <n-tag v-model:checked="model.roof.roof" checkable>
            Coberto
          </n-tag>
          <n-tag v-model:checked="model.roof.indoor" checkable>
            Indoor
          </n-tag>
        </n-space>
      </n-form-item-gi>
      <n-form-item-gi span="4" offset="1" class="button-refresh">
        <n-button @click="goToLink">
          <template #icon>
            <n-icon :component="Refresh"></n-icon>
          </template>
        </n-button>
      </n-form-item-gi>
    </n-grid>
    <div style="display: flex; justify-content: flex-end">
      <n-button :loading="loading" strong secondary type="primary" icon-placement="right"
        @click="handleValidateButtonClick">
        Pesquisar
        <template #icon>
          <n-icon :component="Search"></n-icon>
        </template>
      </n-button>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import { FormInst, NButton, NForm, NFormItemGi, NGrid, NSelect, NDatePicker, NTimePicker, NRadioGroup, NRadioButton, NTag, NSpace, NConfigProvider, GlobalTheme, darkTheme, NGlobalStyle, NGradientText, NIcon } from 'naive-ui';
import { Search, Refresh } from '@vicons/ionicons5'
import { ref } from 'vue'
import { Roof } from '../models/roof';
import { Sports } from "../models/sports"
import { Court, CourtResult } from '../models/court';
import { UrbanSportsPadel, UrbanSportsFilteredPadel } from '../assets/courts/padel.json';


const proxy = "https://cors-anywhere.herokuapp.com/";

const loading = ref(false);

defineProps({
  collapseState: {
    type: Array,
    default: ["1"]
  },
  courts: {
    type: Array,
    default: []
  },
})

const emit = defineEmits(['update:collapseState', 'update:courts'])

const formRef = ref<FormInst | null>(null)

let roof = ref({
  noroof: true,
  roof: true,
  indoor: true
});

const model = ref({
  sport: 4,
  city: 12,
  date: '',
  time: '',
  duration: 90,
  roof,
  courts: 2
})

const sports = [{ label: "Padel", value: 4 }, { label: "Futebol 5", value: 1 }, { label: "Tenis", value: 3 }];

const cities = [{ label: "Porto", value: 12 }];

const courtsPadel = [{ label: "Todos", value: 0 }, { label: "Urban Sports - Todos", value: 1, data: UrbanSportsPadel }, { label: "Urban Sports", value: 2, data: UrbanSportsFilteredPadel }];
// const courtsFutebol5 = [{ label: "Todos", value: 0 }, { label: "Urban Sports - Todos", value: 1, data:  }, { label: "Urban Sports", value: 2, data:  }];
// const courtsTenis = [{ label: "Todos", value: 0 }, { label: "Urban Sports - Todos", value: 1, data:  }, { label: "Urban Sports", value: 2, data:  }];
let courtsSel = courtsPadel;

const goToLink = () => {
  window.open('https://cors-anywhere.herokuapp.com/', '_blank');
}

const getCurrentDate = () => {
  const temp = new Date();
  const offset = temp.getTimezoneOffset();

  temp.setTime(temp.getTime() - (offset * 60 * 1000))
  if (temp.getMinutes() < 30) {
    temp.setMinutes(30);
  }
  else {
    temp.setMinutes(0);
    temp.setTime(temp.getTime() + (60 * 60 * 1000));
  }

  const datetime = temp.toISOString().split('T');
  const time = datetime[1].split(':');
  model.value.date = datetime[0];
  model.value.time = `${time[0]}:${time[1]}`;
}

const handleSport = (value: number) => {
  switch (value) {
    case Sports.Padel:
      model.value.duration = 90;
      courtsSel = courtsPadel;
      break;

    case Sports.Futebol5:
      model.value.duration = 60;
      courtsSel = courtsPadel;
      break;

    case Sports.Tenis:
      model.value.duration = 60;
      courtsSel = courtsPadel;
      break;
  }
}

const filterCourts = (court_id: number): boolean => {
  const temp = courtsSel[model.value.courts].data;
  if (temp) {
    return temp.find(s => s.id === court_id) ? false : true;
  }
  return false;
}

const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      console.log('Valid')
      const url = proxy + "https://www.aircourts.com/index.php/v2/api/search?sport=" + model.value.sport +
        "&city=" + model.value.city +
        "&date=" + model.value.date +
        "&start_time=" + model.value.time +
        "&page=1&page_size=100000";

      const headers = { 'X-Requested-With': '' };
      loading.value = true;
      const res = await fetch(url, { headers })
      const data = await res.json();
      getCourts(data);
      loading.value = false;
      emit('update:collapseState', ["2"])

    } else {
      console.log(errors)
      console.log('Invalid')
    }
  })
}

const getCourts = (data: any) => {
  console.log(data);
  let courts = [];
  for (const result of data.results) {
    const court = new Court(result);
    if (isInvalidRoof(court.roof) || filterCourts(court.club_id)) continue; //Exit to next iteration if invalid
    const slotLength = court.booking_calendar_length;
    const slots = court.slots;
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      let freeSlots = 0;
      for (let j = i; j < slots.length; j++) {
        if (slots[j].locked) break;
        freeSlots++;
        if ((freeSlots * slotLength) == model.value.duration) {
          courts.push(new CourtResult(court, slot.start, slots[j].end));
          break;
        }
      }
    }
  }
  courts.sort(function (a, b) {
    return ('' + a.startTime).localeCompare(b.startTime);;
  })
  console.log(courts)
  emit('update:courts', courts);
}

const isInvalidRoof = (value: number) => {
  switch (value) {
    case Roof.Descoberto:
      return !model.value.roof.noroof;
    case Roof.Coberto:
      return !model.value.roof.roof;
    case Roof.Indoor:
      return !model.value.roof.indoor;
  }
}

(async () => {
  getCurrentDate();
})()

</script>

<style lang="scss">
.button-refresh {
  justify-self: flex-end;
}

// .n-button .n-button__icon .n-icon-slot {
//   align-items: center
// }
</style>
