<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const test = ref(0)
const backgroundColor = ref('#ffffff') // Couleur de fond initiale
let intervalId = null

// Fonction pour incrémenter la valeur de test
function Increment(){
    test.value++
}

// Fonction pour changer de page
function ChangePage(){
    controller.changePage("BaseExample","PageTwo",{})
}

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

// Démarrer le changement de couleur lorsque le composant est monté
onMounted(() => {
    intervalId = setInterval(() => {
        backgroundColor.value = getRandomColor()
    }, 10) // Change toutes les 10ms
})

// Arrêter le changement de couleur lorsque le composant est démonté
onBeforeUnmount(() => {
    clearInterval(intervalId)
})
</script>

<template>
  <div :style="{ backgroundColor: backgroundColor, width: '100%', height: '100vh' }">
    {{ test }} <button @click="Increment"> increment</button>
    <button @click="ChangePage"> azdadazd</button>
    {{ appName }}
  </div>
</template>