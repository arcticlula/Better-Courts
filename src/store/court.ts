import { Court, CourtResult, ICourtSelection, ISlot } from '@/models/court';
import { Roof } from '@/models/roof';
import { defineStore, storeToRefs } from 'pinia'
import { useGlobalStore } from './global';
import { UrbanSportsPadel, UrbanSportsIndPadel, UrbanSportsFilteredPadel } from '../assets/courts/padel.json';
import { UrbanSportsFutebol5, UrbanSportsFilteredFutebol5 } from '../assets/courts/futebol5.json';
import { UrbanSportsTenis } from '../assets/courts/tenis.json';
import { Sports } from '@/models/sports';
import { useSearchStore } from './search';

const courtsPadel = [
  { label: "Todos", value: 0 },
  { label: "Urban Sports", value: 1, data: UrbanSportsFilteredPadel },
  { label: "Individual", value: 2, data: UrbanSportsIndPadel },
  { label: "Urban Sports - Todos", value: 3, data: UrbanSportsPadel }
];

const courtsFutebol5 = [
  { label: "Todos", value: 0 },
  { label: "Urban Sports", value: 1, data: UrbanSportsFilteredFutebol5 },
  { label: "Urban Sports - Todos", value: 2, data: UrbanSportsFutebol5 }
];

const courtsTenis = [
  { label: "Todos", value: 0 },
  { label: "Urban Sports", value: 1, data: UrbanSportsTenis }
];

export const useCourtStore = defineStore('court', {
  state: () => ({
    courts: [] as CourtResult[],
    currentCourt: null as CourtResult | null,
    courtsSelection: courtsPadel as ICourtSelection[]
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

      const headers = { 'X-Requested-With': '', 'Access-Control-Allow-Origin': 'true' };
      const res = await fetch(url, { headers });
      searchButtonLoading.value = false;
      if (res.ok) {
        this.courts = await filterCourts(await res.json());
        collapseState.value = ['2']
        return true;
      }
      else {
        return false;
      }
    },
    setCourtsSelection() {
      const searchStore = useSearchStore()
      const { searchForm } = storeToRefs(searchStore);

      switch (searchForm.value.sport) {
        case Sports.Padel:
          searchForm.value.duration = 90;
          this.courtsSelection = courtsPadel;
          break;

        case Sports.Futebol5:
        case Sports.Futsal:
          searchForm.value.duration = 60;
          this.courtsSelection = courtsFutebol5;
          break;

        case Sports.Tenis:
          searchForm.value.duration = 60;
          this.courtsSelection = courtsTenis;
          break;
      }
    }
  },
})

const filterCourts = async (data: any) => {
  const searchStore = useSearchStore()
  const { searchForm } = storeToRefs(searchStore);

  let courts = [];
  for (const result of data.results) {
    const court = new Court(result);
    const slots = court.slots;
    if (isInvalidRoof(court.roof) || filterByClubs(court.club_id, slots)) continue; //Exit to next iteration if invalid
    const minLength = court.booking_length;
    // console.log(court)
    // if (minLength == 90) {
    //   const url = 'https://cors-anywhere.herokuapp.com/' + 'https://www.aircourts.com/index.php/api/search_with_club/' + court.club_id +
    //     "?sport=" + searchForm.value.sport +
    //     "&date=" + searchForm.value.date +
    //     "&start_time=" + searchForm.value.time;

    //   const headers = { 'X-Requested-With': '' };
    //   const res = await fetch(url, { headers });
    //   if (res.ok) {
    //     console.log(await res.json());
    //   }
    // }
    // else {
    const slotLength = court.booking_calendar_length;
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
    // }
  }
  courts.sort(function (a, b) {
    return ('' + a.datetime).localeCompare(b.datetime);;
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

const filterByClubs = (club_id: number, slots: ISlot[]): boolean => {
  const courtStore = useCourtStore()
  const searchStore = useSearchStore()
  const { courtsSelection } = storeToRefs(courtStore);
  const { searchForm } = storeToRefs(searchStore);

  const clubs = courtsSelection.value[searchForm.value.courts].data;
  if (clubs) {
    const club = clubs.find(s => s.id === club_id);
    if (club) {
      const courtId = club?.court_id;
      // console.log(courtId)
      if (courtId) {
        //   const toBeFiltered = Math.sign(courtId) === -1;
        const id = parseInt(slots[0]?.court_id, 10);
        return courtId.find(s => s === id) ? false : true;
      }
      else {
        return false; //Club but no specific court
      }
    }
    else {
      return true; //No Club
    }
  }
  return false; //No filter Applied
}
