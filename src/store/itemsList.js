import { defineStore } from 'pinia';

export const useItemsListStore = defineStore('itemsList', {
  state: () => ({
    itemsList : {
        0: { weight: 500, label: 'burger de fou qui tue', img: "280.png" }
    }
  }),
  getters: {
    
  },
  actions: {
    setItemsList(value) {
      this.itemsList = value;
    }
  },
});