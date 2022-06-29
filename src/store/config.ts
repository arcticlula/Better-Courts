import { defineStore, storeToRefs } from 'pinia'
import { darkTheme, lightTheme, useOsTheme } from 'naive-ui';
import { nextTick, ref } from 'vue';
import { useSearchStore } from './search';
import { useCourtStore } from './court';

const searchConfig = ref({
  sport: false,
  court: false,
  datetime: false,
  roof: false
});

export const useConfigStore = defineStore('config', {
  state: () => ({
    theme: 'dark',
    searchConfig
  }),
  getters: {
    getTheme({ theme }) {
      switch (theme) {
        case 'light':
          return lightTheme;
        case 'dark':
          return darkTheme;
        default:
          const os = useOsTheme();
          return os.value == 'dark' ? darkTheme : null;
      }
    },
  },
  actions: {
    getInitialConfig() {
      const searchStore = useSearchStore()
      const courtStore = useCourtStore()
      const { searchForm } = storeToRefs(searchStore);
      const { courtsSelection } = storeToRefs(courtStore);

      const config = this.getConfig();
      if (config) {
        this.theme = config.theme;
        this.searchConfig = config.searchConfig;
        let search = {
          sport: 4,
          city: 12,
          date: '',
          time: '',
          duration: 90,
          roof: {
            noroof: true,
            roof: true,
            indoor: true
          },
          courts: 1
        }
        if (this.searchConfig.sport) {
          search.sport = config.searchForm.sport;
          search.duration = config.searchForm.duration;
          courtsSelection.value = config.courtsSelection;

          if (this.searchConfig.court) {
            search.courts = config.searchForm.courts;
          }
        }
        if (this.searchConfig.datetime) {
          search.date = config.searchForm.date;
          search.time = config.searchForm.time;
        }
        if (this.searchConfig.roof) {
          search.roof = config.searchForm.roof;
        }
        searchForm.value = search;
      }
    },

    getConfig() {
      const item = localStorage.getItem('config');
      return item ? JSON.parse(item) : item;
    },

    async saveConfig() {
      await nextTick()
      const searchStore = useSearchStore()
      const courtStore = useCourtStore()
      const { searchForm } = storeToRefs(searchStore);
      const { courtsSelection } = storeToRefs(courtStore);

      const config = {
        theme: this.theme,
        searchForm: searchForm.value,
        courtsSelection: courtsSelection.value,
        searchConfig: this.searchConfig
      }

      localStorage.setItem('config', JSON.stringify(config));
    },
  },
})
