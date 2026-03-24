export interface AppState {}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({}),
  actions: {},
  getters: {},
});
