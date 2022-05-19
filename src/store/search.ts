import { defineStore } from 'pinia'
import { ref } from 'vue';

const roof = ref({
  noroof: true,
  roof: true,
  indoor: true
});

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchForm: {
      sport: 4,
      city: 12,
      date: '',
      time: '',
      duration: 90,
      roof,
      courts: 1
    },
  }),
  actions: {

  },
})
