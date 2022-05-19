import { Court, CourtResult } from '@/models/court';
import { Roof } from '@/models/roof';
import { useMessage } from 'naive-ui';
import { defineStore, storeToRefs } from 'pinia'
import { useGlobalStore } from './global';
import { UrbanSportsPadel, UrbanSportsFilteredPadel } from '../assets/courts/padel.json';
import { UrbanSportsTenis } from '../assets/courts/tenis.json';
import { Sports } from '@/models/sports';
import { useSearchStore } from './search';

const message = useMessage();

const courtsPadel = [
  { label: "Todos", value: 0 },
  { label: "Urban Sports", value: 1, data: UrbanSportsFilteredPadel },
  { label: "Urban Sports - Todos", value: 2, data: UrbanSportsPadel }
];
// const courtsFutebol5 = [{ label: "Todos", value: 0 }, { label: "Urban Sports - Todos", value: 1, data:  }, { label: "Urban Sports", value: 2, data:  }];
const courtsTenis = [
  { label: "Todos", value: 0 },
  { label: "Urban Sports", value: 1, data: UrbanSportsTenis }
];

export const useCourtStore = defineStore('court', {
  state: () => ({
    courts: [] as CourtResult[],
    currentCourt: null as CourtResult | null,
    courtsSelection: courtsPadel
  }),
  // getters: {
  //   collapseState: state => state.collapseState
  // },
  actions: {
    async getCourts() {
      const searchStore = useSearchStore()
      const globalStore = useGlobalStore()
      const { searchForm } = storeToRefs(searchStore);
      const { proxy } = globalStore;
      const { collapseState, searchButtonLoading } = storeToRefs(globalStore);

      searchButtonLoading.value = true;
      const url = proxy + "https://www.aircourts.com/index.php/v2/api/search?sport=" + searchForm.value.sport +
        "&city=" + searchForm.value.city +
        "&date=" + searchForm.value.date +
        "&start_time=" + searchForm.value.time +
        "&page=1&page_size=100000";

      const headers = { 'X-Requested-With': '' };
      const res = await fetch(url, { headers });
      if (res.ok) {
        this.courts = filterCourts(await res.json());
        collapseState.value = ['2']
      }
      else {
        message.error('Não foi possível fazer o pedido.', { duration: 2000 });
      }
      searchButtonLoading.value = false;
    },
    setCourtsSelection(sport: Sports) {
      const searchStore = useSearchStore()
      const { searchForm } = storeToRefs(searchStore);

      switch (sport) {
        case Sports.Padel:
          searchForm.value.duration = 90;
          this.courtsSelection = courtsPadel;
          break;

        case Sports.Futebol5:
          searchForm.value.duration = 60;
          this.courtsSelection = courtsPadel;
          break;

        case Sports.Tenis:
          searchForm.value.duration = 60;
          this.courtsSelection = courtsTenis;
          break;
      }
    }
  },
})

const filterCourts = (data: any) => {
  const searchStore = useSearchStore()
  const { searchForm } = storeToRefs(searchStore);

  let courts = [];
  for (const result of data.results) {
    const court = new Court(result);
    if (isInvalidRoof(court.roof) || filterByCourts(court.club_id)) continue; //Exit to next iteration if invalid
    const slotLength = court.booking_calendar_length;
    const slots = court.slots;
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      let freeSlots = 0;
      for (let j = i; j < slots.length; j++) {
        if (slots[j].locked) break;
        freeSlots++;
        if ((freeSlots * slotLength) == searchForm.value.duration) {
          courts.push(new CourtResult(court, slot.date, slot.start, slots[j].end));
          break;
        }
      }
    }
  }
  courts.sort(function (a, b) {
    return ('' + a.startTime).localeCompare(b.startTime);;
  })
  return courts;
}

const isInvalidRoof = (roof: number) => {
  const searchStore = useSearchStore()
  const { searchForm } = storeToRefs(searchStore);

  switch (roof) {
    case Roof.Descoberto:
      return !searchForm.value.roof.noroof;
    case Roof.Coberto:
      return !searchForm.value.roof.roof;
    case Roof.Indoor:
      return !searchForm.value.roof.indoor;
  }
}

const filterByCourts = (court_id: number): boolean => {
  const courtStore = useCourtStore()
  const searchStore = useSearchStore()
  const { courtsSelection } = storeToRefs(courtStore);
  const { searchForm } = storeToRefs(searchStore);

  const courts = courtsSelection.value[searchForm.value.courts].data;
  if (courts) {
    return courts.find(s => s.id === court_id) ? false : true;
  }
  return false;
}
