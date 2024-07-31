<script setup>
import {ref} from 'vue'
import HelloWorld from '../../components/HelloWorld.vue'
import TheWelcome from '../../components/TheWelcome.vue'

const test = ref(0)

function Increment(){
    test.value++;
}

function ChangePage(){
    controller.changePage("BaseExample","PageTwo",{})
}

</script>


<template>
  {{ test }} <button @click="Increment"> increment</button>
  <button @click="ChangePage" >azdadazd</button>
  {{ appName }}
</template>

