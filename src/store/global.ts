import { defineStore } from 'pinia'
import { darkTheme, lightTheme, useOsTheme, GlobalTheme } from 'naive-ui';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    proxy: 'https://corsproxy.io/?',
    // proxy: 'https://cors-anywhere.herokuapp.com/',
    theme: 'dark',
    collapseState: ["1"],
    showSettingsModal: false,
    showCourtModal: false,
    searchButtonLoading: false
  }),
  getters: {
    getTheme({ theme }) {
      switch (theme) {
        case 'light':
          return lightTheme;
        case 'dark':
          return darkTheme;
        default:
          return null;
      }
    },
  },
  actions: {
    setInitialConfig() {
      const globalStore = useGlobalStore()
      const { getConfig, setTheme } = globalStore;

      const thm = getConfig('theme');
      if (thm) setTheme(thm);
    },
    setTheme(thm: any) {
      console.log(thm)
      const globalStore = useGlobalStore()
      const { saveConfig } = globalStore;

      this.theme = thm === 'os' ? useOsTheme() : thm;
      saveConfig('theme', thm);
    },
    getConfig(key: string) {
      return localStorage.getItem(key);
    },
    saveConfig(key: string, value: string) {
      localStorage.setItem(key, value);
    },
  },
})
