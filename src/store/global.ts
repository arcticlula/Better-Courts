import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    proxy: 'https://corsproxy.io/?',
    // proxy: 'https://cors-anywhere.herokuapp.com/',
    collapseState: ["1"],
    showSettingsModal: false,
    showCourtModal: false,
    searchButtonLoading: false
  }),
  getters: {
  },
  actions: {

  },
})
