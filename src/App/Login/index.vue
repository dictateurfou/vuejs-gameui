<template>
    <!-- Affichage des notifications -->
    <transition-group name="notification" tag="div" class="notification-container">
      <div
        v-for="(notification, index) in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
      >
        <div class="notification-content">
          <span class="emoji">{{ notification.emoji }}</span>
          <div>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
        </div>
      </div>
    </transition-group>
  
    <!-- Contenu existant -->
    <div id="box">
      <div :class="[{'active' : activeTab == 'connect'},'action-menu']" @click="SetTab('connect')">
        <p>Connexion</p>
      </div>
      <div :class="[{'active' : activeTab == 'register'},'action-menu']" @click="SetTab('register')">
        <p>Inscription</p>
      </div>
      <div v-if="activeTab === 'register'" class="input-base" @click="OnInputClick">
        <label :class="{ 'not-empty': email.length > 0 }" for="email">Email</label>
        <input v-model="email" type="text" />
      </div>
      <div class="input-base" @click="OnInputClick">
        <label :class="{ 'not-empty': name.length > 0 }" for="name">Nom d'utilisateur</label>
        <input v-model="name" type="text" />
      </div>
      <div class="input-base" @click="OnInputClick">
        <label :class="{ 'not-empty': password.length > 0 }" for="pass">Mot de passe</label>
        <input v-model="password" type="password" />
      </div>
  
      <button class="btn" @click="ConnectOrRegister">Valider</button>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  
  const activeTab = ref('connect');
  const email = ref('');
  const name = ref('');
  const password = ref('');
  
  // Système de notifications
  const notifications = reactive([]);
  
  function addNotification(message, type = 'info') {
    const id = Date.now() + Math.random();
  
    // Définir les émojis et les titres en fonction du type de notification
    let emoji = '';
    let title = '';
    switch (type) {
      case 'success':
        emoji = '✅';
        title = 'Succès';
        break;
      case 'error':
        emoji = '❌';
        title = 'Erreur';
        break;
      case 'info':
      default:
        emoji = 'ℹ️';
        title = 'Information';
        break;
    }
  
    notifications.push({ id, title, message, emoji, type });
  
    // Supprimer la notification après 5 secondes
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }
  
  function removeNotification(id) {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  }
  
  function OnInputClick(event) {
    event.preventDefault();
  
    if (event.target.querySelector('input')) {
      event.target.querySelector('input').focus();
    }
  }
  
  function SetTab(tab) {
    // Votre fonction existante
    activeTab.value = tab;
  }
  
  async function ConnectOrRegister() {
    const payload = {
      email: email.value,
      name: name.value,
      password: password.value,
    };
  
    if (activeTab.value === 'connect') {
      try {
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
  
        if (data.success) {
          addNotification('Vous êtes maintenant connecté !', 'success');
          // Actions supplémentaires en cas de succès
          controller.eventManager.callGameEvent("onLogin",data.token)
          //CallUnreal("onLogin", JSON.stringify([data.token]));
          //controller.destroyApp("Login")
        } else {
          addNotification(data.message, 'error');
        }
      } catch (error) {
        console.error(error);
        addNotification('Une erreur est survenue lors de la connexion.', 'error');
      }
      
    } else {
      // Code pour l'inscription
      try {
        const response = await fetch('http://localhost:8080/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
  
        if (data.success) {
          addNotification('Votre compte a été créé avec succès !', 'success');
          // Actions supplémentaires en cas de succès
        } else {
          addNotification(data.message, 'error');
        }
      } catch (error) {
        console.error(error);
        addNotification('Une erreur est survenue lors de l\'inscription.', 'error');
      }
    }
  }
  </script>
  
  <style>
  @import '../../assets/base.css';
  </style>
  
<style scoped>
/* Styles pour les notifications */
.notification-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.notification {
  background-color: #fff;
  color: #444;
  padding: 10px 15px; /* Réduit le padding */
  margin-top: 10px;
  border-radius: 8px;
  min-width: 250px; /* Réduit la largeur minimale */
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.notification-content {
  display: flex;
  align-items: center;
}

.emoji {
  font-size: 1.5em; /* Réduit la taille de l'émoji */
  margin-right: 10px; /* Réduit l'espacement à droite de l'émoji */
}

.notification-title {
  font-weight: bold;
  margin: 0;
  font-size: 1em; /* Réduit la taille du titre */
}

.notification-message {
  margin: 3px 0 0 0; /* Réduit l'espace entre le titre et le message */
  font-size: 0.9em; /* Réduit la taille du message */
}

/* Styles spécifiques */
.notification.success {
  border-left: 5px solid #4caf50;
}

.notification.error {
  border-left: 5px solid #f44336;
}

.notification.info {
  border-left: 5px solid #2196f3;
}

/* Styles pour la transition */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.notification-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.notification-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
  
  /* Vos styles existants */
  .btn {
    all: unset;
    font-size: 1.3em;
    background-color: rgb(33, 33, 33);
    padding: 0.3em 1em;
    margin-top: 1em;
    border-radius: 33px;
    text-transform: uppercase;
    border: 2px solid #fff;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: var(--base-blue);
  }
  
  .input-base {
    height: 50px;
    background-color: rgb(33, 33, 33);
    border-bottom: 1px solid rgb(133, 133, 133);
    width: 80%;
    margin: 0 auto;
    margin-top: 15px;
    position: relative;
  }
  
  input {
    all: unset;
    text-align: left;
    position: absolute;
    bottom: 0px;
    left: 0px;
    margin-left: 5px;
    width: 100%;
    height: 55%;
  }
  
  .input-base:focus-within label {
    top: 5px;
    font-size: 1em;
  }
  
  label.not-empty {
    top: 5px;
    font-size: 1em;
  }
  
  label {
    position: absolute;
    left: 8px;
    top: 25%;
    font-size: 1.4em;
    z-index: 999;
    pointer-events: none;
    transition: top 0.3s ease, font-size 0.3s ease;
    font-weight: 600;
  }
  
  #box {
    text-align: center;
    width: 20rem;
    background-color: var(--base-background);
    color: #fff;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    border: 3px solid #e2e2e2;
    overflow: hidden;
    padding-bottom: 1em;
  }
  
  .action-menu {
    display: inline-block;
    width: 50%;
    height: 3em;
    text-align: center;
    background-color: rgb(66, 66, 66);
    border-bottom: 2px solid #fff;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-bottom: 10px;
  }
  
  .action-menu.active {
    background-color: var(--base-blue);
  }
  
  .action-menu:hover {
    background-color: var(--base-red);
  }
  
  .action-menu:nth-child(1) {
    border-right: 1px solid #e2e2e2;
  }
  
  .action-menu:nth-child(2) {
    border-left: 1px solid #e2e2e2;
  }
  
  .action-menu p {
    font-size: 1.2em;
    font-weight: 600;
    position: relative;
    top: 25%;
  }
  </style>