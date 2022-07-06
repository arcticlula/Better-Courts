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

      // const headers = { 'X-Requested-With': '', 'Access-Control-Allow-Origin': 'true', 'Origin': 'true' };
      const headers = { 'Access-Control-Allow-Origin': 'true' };
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

    async getDetailedCourts(club_id: number) {
      const globalStore = useGlobalStore()
      const { proxy } = globalStore;
      const searchStore = useSearchStore()
      const { searchForm } = storeToRefs(searchStore);

      const url = proxy + 'https://www.aircourts.com/index.php/api/search_with_club/' + club_id +
        "?sport=" + searchForm.value.sport +
        "&date=" + searchForm.value.date +
        "&start_time=" + searchForm.value.time;

      const headers = { 'X-Requested-With': '' };
      const res = await fetch(url, { headers });
      if (res.ok) {
        return await filterDetailedCourts(await res.json());
      }
      else return [];
    },

    setCourtsSelection() {
      const searchStore = useSearchStore()
      const { searchForm } = storeToRefs(searchStore);
      searchForm.value.courts = 1;

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
  const courtStore = useCourtStore()
  const { searchForm } = storeToRefs(searchStore);
  const { getDetailedCourts } = courtStore;

  const duration = searchForm.value.duration

  let courts = [];
  let exceptions: number[] = [];
  for (const result of data.results) {
    const court = new Court(result);
    const { club_id, slots, roof, booking_length: min_length, booking_calendar_length: slotLength } = court;
    if (isInvalidRoof(roof) || filterByClubs(club_id, slots) || min_length > duration) continue; //Exit to next iteration if invalid
    if (min_length == 90) {
      if (!exceptions.find(s => s == club_id)) {
        exceptions.push(club_id); //in order to not repeat the request for the same club
        const detailedCourts = await getDetailedCourts(club_id);
        courts.push(...detailedCourts);
      }
    }
    else {
      for (let i = 0; i < slots.length; i++) {
        const { date, start } = slots[i];
        let freeSlots = 0;
        for (let j = i; j < slots.length; j++) {
          if (slots[j].locked) break;
          freeSlots++;
          if ((freeSlots * slotLength) == duration) {
            const end = addTime(start, duration);
            courts.push(new CourtResult(court, date, start, end));
            break;
          }
        }
      }
    }
  }
  courts.sort(function (a, b) {
    return ('' + a.datetime).localeCompare(b.datetime);;
  })
  return courts;
}

const filterDetailedCourts = async (data: any) => {
  const searchStore = useSearchStore()
  const { searchForm } = storeToRefs(searchStore);
  const duration = searchForm.value.duration
  let courts = [];

  for (const result of data.results) {
    const court = new Court(result);
    const { club_id, slots, roof } = court;
    if (isInvalidRoof(roof) || filterByClubs(club_id, slots)) continue; //Exit to next iteration if invalid
    for (let i = 0; i < slots.length; i++) {
      const { date, start, locked, durations } = slots[i];
      if (!locked && durations?.find(d => d == duration)) {
        const end = addTime(start, duration);
        courts.push(new CourtResult(court, date, start, end));
      }
    }
  }
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
      if (courtId) {
        const id = parseInt(slots[0]?.court_id, 10);
        let toBeRemoved = false;
        for (let court of courtId) {
          const isSameCourt = Math.abs(court) === id;
          const toBeFiltered = Math.sign(court) === -1;
          //if it's the same court remove - if negative sign - or don't - if positive sign
          if (isSameCourt) {
            toBeRemoved = toBeFiltered ? true : false;
            break;
          }
          //if positive sign and not the same court - set to be removed - unless it finds a match in the previous condition
          else if (!toBeFiltered) {
            toBeRemoved = true;
          }
        }
        return toBeRemoved;
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

const addTime = (time: string, duration: number) => {
  const split = time.split(':');
  let hour = parseInt(split[0], 10);
  let minutes = parseInt(split[1], 10);

  hour += Math.floor(duration / 60);
  minutes += duration % 60;
  if (minutes >= 60) {
    hour++;
    minutes -= 60;
  }
  hour = hour >= 24 ? hour - 24 : hour;
  return `${('0' + hour).slice(-2)}:${('0' + minutes).slice(-2)}`;
}
