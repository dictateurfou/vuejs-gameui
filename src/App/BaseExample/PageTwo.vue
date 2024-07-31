<script setup>
import {ref} from 'vue'
import HelloWorld from '../../components/HelloWorld.vue'
import TheWelcome from '../../components/TheWelcome.vue'

const test = ref(0)

function Increment(){
    test.value++;
}

</script>


<template>
  {{ test }} <button @click="Increment"> increment page 2</button>
</template>

