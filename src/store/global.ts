import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    proxy: 'https://corsproxy.io/?',
    // proxy: 'https://cors-anywhere.herokuapp.com/',
    collapseState: ["1"],
    showCourtModal: false,
    searchButtonLoading: false
  }),
  // getters: {
  //   collapseState: state => state.collapseState
  // },
  actions: {
    setCollapse(state: string[]) {
      // this.collapseState = state;
    },
  },
})
