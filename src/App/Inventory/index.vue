<!-- its a old template use for my inventory backend maybe need to rewrite that because i have changed multiple time the theme-->

<template>
  <div id="container" ref="container">
      <div id="container2">
          <!-- Conteneur d'utilisation -->
          <div v-if="onUseContainer" id="item-use" v-click-outside="closeUse">
              <img :src="useData.img" />
              <h3 id="item-name">{{ useData.label }}</h3>
              <button class="btn" @click="useItem">Utiliser</button>
              <button class="btn" @click="dropItem">Jeter</button>
          </div>

          <!-- Sélection de quantité -->
          <div v-if="onSelectableQuantity" id="selectable-quantity">
              <img :src="selectableQuantityData.image" />
              <div id="amount">{{ selectableQuantityData.maxQty }}</div>
              <p id="label">{{ selectableQuantityData.label }}</p>
              <div id="input-container">
                  <button @click="setSelectableQuantity(1)">1</button>
                  <input type="number" v-model="selectableQuantityInput" />
                  <button @click="setSelectableQuantity(selectableQuantityData.maxQty)">
                      {{ selectableQuantityData.maxQty }}
                  </button>
              </div>
              <button class="btn" @click="sendSelectableQuantity()">Valider</button>
              <button class="btn" style="background-color:#BC023F;" @click="hideSelectableQuantity()">Annuler</button>
          </div>

          <!-- Liste de l'inventaire -->
          <template v-for="(inv, key) in inventory" :key="key">
              <div 
                  :id="inv.type === 'personal' ? 'player-inv' : 'other-inv'"
                  v-onDragDrop="dragdrop"
                  :drop-args="[inv.identifier, inv.type]"
              >
                  <section id="header">
                      <p id="weight-value">{{ inv.label }}</p>
                      <label for="weight">
                          {{ calculWeight(inv.items) }}/{{ inv.weight / 1000 }} kg <i class="fas fa-cube"></i>
                      </label>
                      <progress id="weight" :max="inv.weight / 1000" :value="calculWeight(inv.items)">
                          {{ (calculWeight(inv.items) / (inv.weight / 1000)) * 100 }}%
                      </progress>
                  </section>

                  <section id="content">
                      <ul>
                          <li 
                              v-for="(item, k2) in inv.items" 
                              :key="k2" 
                              @click="rapidTransfert($event, k2, inv.identifier, key)" 
                              draggable="false" 
                              @mousemove="itemHover(item.id, item.arg)" 
                              @mouseleave="mouseLeave" 
                              v-onDrag="drag" 
                              :drag-args="[inv.identifier, inv.type, k2, item.qty]" 
                              v-onDragStop="dragend"
                          >
                              <p id="qty1">{{ item.qty }}x</p>
                              <img draggable="false" width="90%" :src="getImgSrc(item.id, item.arg)" />
                              <p id="item-label">{{ getLabel(item.id, item.arg) }}</p>
                          </li>

                          <!-- Cases vides -->
                          <template v-if="Object.keys(inv.items).length < 25">
                              <li v-for="index in (25 - Object.keys(inv.items).length)" :key="index + 99999">
                                  <img draggable="false" src="/inventory/empty.png" />
                              </li>
                          </template>
                      </ul>
                  </section>
              </div>

              <!-- Utilisation rapide (pour le premier inventaire) -->
              <div v-if="key === 0" id="use-container2" :key="key">
                  <input type="number" v-model="selectableQuantityInput" />
                  <button v-onDragDrop="useItem" :drop-args="[]">Utiliser</button>
                  <button v-onDragDrop="sendDrop" :drop-args="[]">Jeter</button>
              </div>
          </template>
      </div>

      <!-- Description de l'item -->
      <div v-if="descOn && inventory.length !== 0" id="item-info" ref="itemInfo">
          <img :src="desc.img" />
          <h3 id="item-name">{{ desc.label }}</h3>
          <div id="item-desc">{{ desc.desc }}</div>
          <div id="item-weight">
              <div id="label">poid</div>
              <div id="value">{{ desc.weight }} kg</div>
          </div>
          <ul id="args">
              <li v-for="(data, index) in desc.arg" :key="index">{{ data.label }} {{ data.value }}</li>
          </ul>
      </div>

      <!-- Raccourcis d'items -->
      <div id="item-shortcut2" v-if="inventory.length !== 0">
          <ul>
              <li @click="shortcut[1] = false" v-onDragDrop="setShortcut" :drop-args="[1]">
                  <p>1</p>
                  <img :src="checkShortcut(1)" />
              </li>
              <li @click="shortcut[2] = false" v-onDragDrop="setShortcut" :drop-args="[2]">
                  <p>2</p>
                  <img :src="checkShortcut(2)" />
              </li>
              <li @click="shortcut[3] = false" v-onDragDrop="setShortcut" :drop-args="[3]">
                  <p>3</p>
                  <img :src="checkShortcut(3)" />
              </li>
              <li @click="shortcut[4] = false" v-onDragDrop="setShortcut" :drop-args="[4]">
                  <p>4</p>
                  <img :src="checkShortcut(4)" />
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex'; // Si vous utilisez Vuex 4 avec Vue 3
import { useItemsListStore } from '@/store/itemsList';
import { storeToRefs } from 'pinia';

export default {
  name: 'Inventory',
  setup(){
    const itemsListStore = useItemsListStore();
    const { itemsList } = storeToRefs(itemsListStore); // Utilisation réactive des propriétés

    return { itemsList: itemsList };
  },
  data() {
      return {
          inventory: [
              {
                  type: 'personal',
                  id: 1500,
                  label: 'youpiiiiii',
                  identifier: "sqdkohjfdqjfjds",
                  items: {
                      0: { id: 0, arg: {}, qty: 30 },
                      2: { id: 0, arg: {}, qty: 30 },
                      3: { id: 0, arg: {}, qty: 30 }
                  },
                  weight: 500000
              },
              {
                  type: 'vehicle',
                  id: 1500,
                  label: 'youpiiiiii',
                  identifier: "sqdkohjfdqjfjds",
                  items: {
                      0: { id: 0, arg: {}, qty: 30 }
                  },
                  weight: 500000
              }
          ],
          cloned: null,
          onDrag: false,
          dragData: {},
          descOn: false,
          timeout: null,
          mouseX: 0,
          mouseY: 0,
          desc: {
              label: "",
              arg: {},
              desc: "",
              weight: 1000,
              img: '/inventory/280.png'
          },
          onSelectableQuantity: false,
          selectableQuantity: {},
          selectableQuantityData: {},
          selectableQuantityInput: 1,
          onSelectableTrashQty: false,
          selectableTrashQty: {},
          onUseContainer: false,
          useData: {
              img: '/inventory/WEAPON_SMG.png',
              label: "burger"
          },
          shortcut: {
              1: false,
              2: false,
              3: false,
              4: false
          }
      };
  },
  methods: {
      hideSelectableQuantity() {
          this.onSelectableTrashQty = false;
          this.onSelectableQuantity = false;
      },
      sendSelectableQuantity() {
          if (this.selectableQuantityInput > 0) {
              this.dragData.qty = Math.floor(this.selectableQuantityInput);
              /*if (this.selectableQuantityData.to.type === this.$store.state.enums.INVENTORY_TYPE.TRASH) {
                  controller.eventManager.callGameEvent(
                      { name: "inventory:trashItem", type: "server" },
                      this.dragData
                  );
              } else {
                  controller.eventManager.callGameEvent(
                      { name: "inventory:requestTransfert", type: "server" },
                      this.dragData,
                      this.selectableQuantityData.to
                  );
              }*/
              this.onSelectableQuantity = false;
          }
      },
      setSelectableQuantity(val) {
          console.log(val);
          this.selectableQuantityInput = val;
      },
      openInventory(inventoryList) {
          this.inventory = inventoryList;
      },
      drag(event, identifier, type, itemIndex, qty) {
          this.dragData = { identifier, type, index: itemIndex, qty };
          this.onDrag = true;
      },
      dragend(event) {
          this.onDrag = false;
      },
      dragdrop(event, el, identifier, type) {
          console.log("drag drop");
          console.log(identifier);
          console.log(type);
          if (this.onDrag) {
              this.dragData.qty = Math.floor(this.selectableQuantityInput);
              if (event.shiftKey) {
                  this.dragData.qty = Math.floor(this.dragData.qty / 2);
              } else if (event.ctrlKey) {
                  // Stop execution car on veut une quantité personnalisée
                  return;
              }

              /*if (this.$store.state.enums.INVENTORY_TYPE.TRASH === type) {
                  controller.eventManager.callGameEvent(
                      { name: "inventory:trashItem", type: "server" },
                      this.dragData
                  );
              } else {
                  controller.eventManager.callGameEvent(
                      { name: "inventory:requestTransfert", type: "server" },
                      this.dragData,
                      { identifier, type }
                  );
              }*/
          }
      },
      setShortcut(event, el, number) {
          this.shortcut[number] = this.dragData.index;
          /*controller.eventManager.callGameEvent(
              { name: "inventory:setShortcut", type: "client" },
              number,
              this.dragData.index
          );*/
      },
      setSelectableQuantityData(dragData, to) {
          for (const [k, v] of Object.entries(this.inventory)) {
              if (v.identifier === dragData.identifier) {
                  const item = v.items[dragData.index];
                  const itemInfo = this.itemsList[item.id];
                  this.selectableQuantityData.identifier = v.identifier;
                  this.selectableQuantityData.maxQty = item.qty;
                  this.selectableQuantityData.label = itemInfo.label;
                  if (item.arg.olabel !== undefined) {
                      this.selectableQuantityData.label = item.arg.olabel;
                  }
                  this.selectableQuantityInput = 1;
                  this.selectableQuantityData.itemId = this.getImgSrc(item.id, item.arg);
                  this.selectableQuantityData.to = to;
                  this.onSelectableQuantity = true;
              }
          }
      },
      setUse(event, itemId, arg, index, qty) {
          this.useData.img = this.getImgSrc(itemId, arg);
          const itemInfo = this.itemsList[itemId];
          this.useData.label = itemInfo.label;
          this.useData.maxQty = qty;
          this.useData.index = index;
          if (arg.olabel !== undefined) {
              this.useData.label = arg.olabel;
          }
          this.onUseContainer = true;
      },
      useItem() {
          /*controller.eventManager.callGameEvent(
              { name: "inventory:useItem", type: "server" },
              this.dragData.index
          );*/
      },
      dropItem() {
          this.onSelectableTrashQty = true;
          this.onUseContainer = false;
          // controller.eventManager.callGameEvent({name:"inventory:dropItem", type:"server"},this.useData.index)
      },
      sendDrop() {
          controller.eventManager.callGameEvent(
              { name: "inventory:dropItem", type: "server" },
              this.dragData.index,
              this.selectableQuantityInput
          );
      },
      closeUse() {
          this.onUseContainer = false;
      },
      getImgSrc(itemId, arg = {}) {
          if (this.itemsList[itemId] !== undefined && this.itemsList[itemId].img !== undefined) {
              return `/inventory/${this.itemsList[itemId].img}`;
          }
          return '/inventory/280.png';
      },
      getLabel(itemId, itemArg) {
          if (this.itemsList[itemId] !== undefined) {
              const item = this.itemsList[itemId];
              if (itemArg.olabel !== undefined) {
                  return itemArg.olabel;
              }
              return item.label;
          }
          return "inconnu";
      },
      onKeyDown(e) {
          console.log(e.key);
          if (e.key === "e" || e.key === "Tab") {
              if (this.inventory.length !== 0) {
                  const allId = this.inventory.map(inv => inv.id);
                  controller.eventManager.callGameEvent(
                      { name: "inventory:unsubScribe", type: "server" },
                      allId
                  );
                  controller.eventManager.callGameEvent({ name: "inventory:fadeOut", type: "client" });
                  this.$eventManager.unfocus();
                  this.inventory = [];
                  this.onSelectableQuantity = false;
                  this.onSelectableTrashQty = false;
                  this.descOn = false;
                  this.onUseContainer = false;
              }
          }
      },
      calculWeight(items) {
          let weight = 0;
          for (const [k, v] of Object.entries(items)) {
              weight += this.itemsList[v.id].weight * v.qty;
          }
          return (weight / 1000).toFixed(1);
      },
      notify(invData) {
          for (let v of this.inventory) {
              if (v.identifier === invData.identifier && v.type === invData.type) {
                  v.items = invData.items;
              }
          }
      },
      mouseMove(event) {
          this.mouseX = event.clientX;
          this.mouseY = event.clientY;
      },
      showDesc(itemId, itemArg) {
          this.$nextTick(() => {
              this.setDesc(itemId, itemArg);
              this.$nextTick(() => {
                  const container = this.$refs.container;
                  const elem = this.$refs.itemInfo;
                  let posY = this.mouseY - elem.offsetHeight;
                  let posX = this.mouseX;
                  if (posY < 0) {
                      posY = 0;
                  }
                  if (posX + elem.offsetWidth > container.offsetWidth) {
                      posX = container.offsetWidth - elem.offsetWidth;
                  }
                  elem.style.left = `${posX}px`;
                  elem.style.top = `${posY}px`;
              });
          });
      },
      setDesc(itemId, itemArg) {
          if (this.itemsList[itemId] !== undefined) {
              const item = this.itemsList[itemId];
              this.desc.desc = item.description;
              this.desc.weight = item.weight / 1000;
              this.desc.img = this.getImgSrc(itemId, itemArg);
              this.desc.label = item.label;
              if (itemArg.olabel !== undefined) {
                  this.desc.label = itemArg.olabel;
              }

              if (itemArg.odesc !== undefined) {
                  this.desc.desc = itemArg.odesc;
              }

              const greenColor = "#A2D12E";
              this.desc.arg = {};
              for (const [k, v] of Object.entries(itemArg)) {
                  if (k === "thirst") {
                      this.desc.arg[k] = { value: v, color: greenColor, label: "Soif" };
                  } else if (k === "food") {
                      this.desc.arg[k] = { value: v, color: greenColor, label: "Faim" };
                  } else if (k === "armor") {
                      this.desc.arg[k] = { value: v, color: greenColor, label: "Armure" };
                  } else if (k === "equiped") {
                      let val = "oui";
                      if (!v) {
                          val = "non";
                      }
                      this.desc.arg[k] = { value: val, color: greenColor, label: "Equiper" };
                  } else if (
                      itemId === this.$store.state.enums.ITEM_ID.WEAPON_COMPV2 &&
                      k === "type"
                  ) {
                      this.desc.arg[k] = { value: v, color: greenColor, label: "Type" };
                  }
              }
          }
      },
      itemHover(itemId, itemArg) {
          if (this.timeout !== null) {
              clearTimeout(this.timeout);
              this.timeout = null;
          }
          if (this.descOn) {
              this.descOn = false;
          } else {
              this.timeout = setTimeout(() => {
                  this.descOn = true;
                  this.showDesc(itemId, itemArg);
              }, 500);
          }
      },
      mouseLeave() {
          if (this.timeout !== null) {
              clearTimeout(this.timeout);
              this.timeout = null;
          }
      },
      checkShortcut(number) {
          if (this.shortcut[number] !== false) {
              for (const v of this.inventory) {
                  if (v.type === this.$store.state.enums.INVENTORY_TYPE.PLAYER) {
                      if (v.items[this.shortcut[number]] !== undefined) {
                          return this.getImgSrc(v.items[this.shortcut[number]].id, v.items[this.shortcut[number]].arg);
                      }
                  }
              }
          }
          return false;
      },
      rapidTransfert(event, index, identifier, invIndex) {
          if (event.shiftKey) {
              const inv = this.inventory[invIndex];
              for (const v of this.inventory) {
                  if (v.identifier !== identifier) {
                      /*controller.eventManager.callGameEvent(
                          { name: "inventory:requestTransfert", type: "server" },
                          {
                              identifier: identifier,
                              type: inv.type,
                              index: index,
                              qty: inv.items[index].qty
                          },
                          { identifier: v.identifier, type: v.type }
                      );*/
                  }
              }
          }
      }
  },
  mounted() {
      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('mousemove', this.mouseMove);
      //this.$eventManager.defineEvent('inventory:open', this.openInventory);
      //this.$eventManager.defineEvent('inventory:notify', this.notify);
  },
  beforeUnmount() { // Anciennement beforeDestroy
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('mousemove', this.mouseMove);
      this.$eventManager.removeEvent('inventory:open');
      this.$eventManager.removeEvent('inventory:notify');
  },
  beforeCreate() {
      if (process.env.NODE_ENV === 'development') {
        console.log("is in dev mode")
          
      }
  }
};
</script>


<style scoped>

* {
  font-family: Signika;
  font-size: 1.5vh;
  font-weight: 400;
  box-sizing: content-box;
  user-select: none;
  margin: 0;
  color: #fff;
}


#container{
    font-family:'Roboto';
    user-select: none;
    overflow:hidden;
    pointer-events: none;
    /*background-color:green;*/
    position: absolute;
    width:100%;
    height:100%;
}

#container2{
    font-family:'Roboto';
    user-select: none;
    overflow:hidden;
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width:80%;
    /*background-color:rgba(0,0,0,0.5);*/
}

#player-inv{
    width:41%;
    height:98%;
    border-radius:5px;
    display:inline-block;
    overflow:hidden;
    pointer-events: auto;
}

#other-inv{
    width:41%;
    height:98%;
    border-radius:5px;
    display:inline-block;
    overflow:hidden;
    pointer-events: auto; 
}


#use-container{
    display:inline-block;
    width:calc(20% - 4em);
    height:100%;
    text-align:center;
}

#use-container button{
    margin:0 auto;
    
    width:70%;
    background-color:rgba(0, 0, 0, 0.774);
}

section#content{
    width:calc(98% - 0.5em);
    margin:0 auto;
    height:calc(55vh + 1em);
    overflow-y:overlay;
    padding-right:0.5em;
}


section#content::-webkit-scrollbar {
    width: 8px; /* width of the entire scrollbar */
}

section#content::-webkit-scrollbar-track {
    border: 3px solid transparent;
    background: linear-gradient(180deg, rgba(36,1,13,0.1) 0%, rgba(51,2,19,1) 25%, rgba(98,3,35,1) 50%, rgba(51,2,19,1) 75%, rgba(41,1,15,0.1) 100%);
    background-clip: content-box;
}

section#content::-webkit-scrollbar-thumb {
    background-color:#161415ab;
    border-radius: 9px;
    background-clip: content-box;
}

section#header{
    width:calc(98% - 0.70em);
    margin-left:0.5em;
}



#header{
    color:#fff;
}

#header p{
    width:calc(50% - 0.8em);
    display:inline-block;
    margin:0.25em;
    text-transform: uppercase;
    font-family:'Roboto';
    font-weight:500;
    font-size:0.85em;
    margin-top:1.5em;
}


#container2 #content ul{
    list-style:none;
    color:#fff;
    /*background-color:red;*/
    margin:0 auto;
    width:100%;
    padding:0em;
    padding-top:0.0em;
    overflow:visible;
}


li{ /* mis sous cette forme pour être appliquer au clone du li lor du drag*/
    display:inline-block;
    width:calc(20% - 0.95em);
    background-color:rgba(0, 0, 0, 0.37);
    margin:0.16em;
    border:0.2vh solid grey;
    border-radius:2px;
    margin-top:0em;
    position:relative;
    overflow:visible;
    padding:1em;
}

li img{
    width:90%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding:0em;
    margin-bottom:0.55em;
}

li .empty-case{
    width:98%;
    height:fit-content;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding:0em;
}

#container2 ul{
    line-height: 0em;
    text-align:center;
}

#container2 li{
    margin:0.1em;
    line-height: normal;
    width:calc(20% - 2.2em);
    /*border: 1px solid rgba(0, 0, 0, 0.2) !important;*/
    border:none;
}


#header{
    color:#fff;
    position:relative;
    font-family:'Roboto';
    font-weight:400;
}

label{
    display:inline-block;
    vertical-align:middle;
    margin: 0 auto;
    position:absolute;
    right:0.2em;
    bottom:1.3em;
}

label .fas{
    vertical-align: middle;
}

progress{
    display:inline-block;
    -webkit-appearance: none;
    width:100%;
    height:10px;
    border-radius: 0.25vh;
    height: 1em;
}

progress::-webkit-progress-bar {
    -webkit-appearance: none;
    color:#55D253;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 0.25vh;
    padding: 2px;
}

progress::-webkit-progress-value { 
    background: #55D253;
    border-radius: 0.25vh;
}

#weight-value{
    font-size:0.75em;
    font-weight:500;
}



#qty1{
    position:absolute;
    right:0em;
    top:0.3em;
    padding:0em;
    margin:0em;
    font-family: Oxygen;
    font-weight:700;
    font-size:0.8em;
    padding:0em 0.2em;
    text-shadow:0.1vh 0.1vh 0 rgba(0, 0, 0, 0.7);
}

#qty2{
    position:absolute;
    right:-0.5em;
    top:-0.5em;
    padding:0em;
    margin:0em;
}

#item-label{
    background-color:rgb(44, 62, 80);
    font-size: 0.7em;
    margin:1px;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    font-family: Oxygen;
    font-weight:700;
    border-top: 1px inset rgba(0, 0, 0, 0.4);
    text-shadow: 0.1vh 0.1vh 0 rgba(0, 0, 0, 0.7);
    position:absolute;
    bottom:0em;
    left:0em;
    width:calc(100%);
    padding:0.2em 0em;
}

/* item info */
#item-info{
    background-color:rgba(37, 37, 39, 0.9);
    width:14em;
    padding:0.7em 0.9em;
    border-radius:3px;
    position:absolute;
    z-index:999;
    pointer-events: none;
}

#item-info img{
    width:22%;
    display:inline-block;
    vertical-align:middle;
}

#item-name{
    color:#E8C428;
    text-transform:uppercase;
    font-size:13px;
    font-weight:500;
    display:inline-block;
    width:68%;
    vertical-align:middle;
    margin-left:1em;
}

#item-desc{
    color:#797981;
    font-weight:500;
    text-align:justify;
    padding:0em 0em;
    font-size:0.9em;
}

#item-weight{
    margin-top:1em;
    color:#fff;
    font-size:0.9em;
    position:relative;
}

#item-weight #label{
    display:inline-block;
}

#item-weight #value{
    display:inline-block;
    position:absolute;
    right:0em;
}

#item-info #args{
    padding:0em;
    margin:0em;
    margin-top:1em;
}

#item-info #args li{
    background:none;
    border:none;
    color:#A2D12E;
    display:block;
    padding:0em;
    margin:0em;
    font-weight:500;
    font-size:0.9em;
    width:100%;
    text-transform:capitalize;
}

/*selectable quantity*/
#selectable-quantity{
    z-index:999;
    width:16em;
    background-color:rgba(37, 37, 39, 0.9);
    border-radius:5px;
    text-align:center;
    position: fixed;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);
    pointer-events: auto;
}

#selectable-quantity input:focus {
    outline: none;
}

#selectable-quantity #label{
    color:#E8C428;
    text-transform:uppercase;
    font-size:13px;
    font-weight:500;
}

#selectable-quantity img{
    width:3.5em;
    margin-top:0.6em;
}

#selectable-quantity #amount{
    position:absolute;
    right:0.4em;
    top:0.4em;
    padding:0em;
    color:#fff;
    margin:0em;
    font-size:1em;
    background-color:#BC023F;
    border-radius:3px;
    padding:0.1em 0.4em;
    
}

#selectable-quantity #input-container button{
    width:3em;
    display:inline-block;
    margin-left:0.5em;
    background-color:#46484E;
    color:#fff;
    border:none;
    font-size:0.9em;
    border-radius:20px;
    padding:0.4em 0em;
    font-family:'Roboto';
}

#selectable-quantity #input-container button:first-of-type{
    margin-left:0em;
}

#selectable-quantity #input-container input{
    width:7em;
    display:inline-block;
    margin-left:0.5em;
    border:1px solid #BC023F;
    background-color:rgba(188, 2, 63, 0.1);
    padding:0.3em 0em;
    border-radius:20px;
    text-align:center;
    color:#fff;
    font-weight:500;
    font-family:'Roboto';
    font-size:15px;
}

#selectable-quantity .btn{
    display:inline-block;
    margin-left:0.5em;
    background-color:#46484E;
    font-family:'Roboto';
    color:#fff;
    border:none;
    font-size:1em;
    font-weight:500;
    border-radius:20px;
    padding:0.5em 1.8em;
    margin-top:1em;
    margin-bottom:2em;
    font-size:14px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


/*use container*/
#item-use{
    z-index:999;
    width:16em;
    background-color:rgba(37, 37, 39, 0.9);
    border-radius:5px;
    text-align:center;
    position: fixed;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);
    pointer-events: auto;
    padding-bottom:0.3em;
}

#item-use .btn{
    display:block;
    font-family:'Roboto';
    color:#fff;
    border:none;
    font-size:1em;
    font-weight:500;
    border-radius:20px;
    padding:0.3em 1.8em;
    font-size:14px;
    background:none;
    width:50%;
    margin:0 auto;
}

#item-use .btn:hover{
    background-color:#46484E;
    font-family:'Roboto';
    color:#fff;
    margin:0 auto;
    font-size:14px;
}

#item-use img{
    width:50%;
}

#item-use h3{
    padding:0em;
    margin:0em;
    margin-bottom:0.3em;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* item shortcut*/
#item-shortcut{
    width:100%;
    margin:0 auto;
    text-align:center;
    position:absolute;
    bottom:-5.5em;
    pointer-events: auto;
}

#item-shortcut ul{
    margin:0 auto;
    padding:0em;
}

#item-shortcut li{
    width:4em;
    height:4em;
    background-color:rgba(0,0,0,0.7);
    border:none;
    color:#fff;
}

#item-shortcut p{
    padding:0em;
    margin:0em;
    position:absolute;
    right:0.1em;
    bottom:0.1em;
}

#item-shortcut2 {
    width:100%;
    margin:0 auto;
    text-align:center;
    position:absolute;
    bottom:1em;
    pointer-events: auto;
}

#item-shortcut2 ul{
    margin:0 auto;
    padding:0em;
}

#item-shortcut2 li{
    width:4.5em;
    height:4.5em;
    background-color:rgba(0,0,0,0.7);
    border:none;
    color:#fff;
}

#item-shortcut2 p{
    padding:0em;
    margin:0em;
    position:absolute;
    right:0.1em;
    bottom:0.1em;
}

#use-container2{
    display:inline-block;
    width:calc(18%);
    height:100%;
    text-align:center;
    pointer-events: auto;
    padding-top:25vh;
    position:relative;
    top:-15vh;
}

#use-container2 button{
    background-color: rgba(12, 12, 12, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25vh;
    padding: 0.9vh;
    text-align: center;
    width: 16vh;
    margin: 0.8vh;
    
}

#use-container2 input{
    background-color: rgba(12, 12, 12, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25vh;
    padding: 0.9vh;
    text-align: center;
    width: 16vh;
    margin: 0.8vh;
    margin-bottom:3em;
    
}
</style>