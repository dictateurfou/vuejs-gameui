<template>
    <div id="box">
        <div :class="[{'active' : activeTab == 'connect'},'action-menu']" @click="SetTab('connect')"><p>Connection</p></div>
        <div :class="[{'active' : activeTab == 'register'},'action-menu']" @click="SetTab('register')"><p>Inscription</p></div>
        <div v-if="activeTab === 'register'" class="input-base" @click="OnInputClick" >
            <label :class="{ 'not-empty': email.length > 0 }" for="email">Email</label>
            <input v-model="email" type="text" />
        </div>
        <div class="input-base" @click="OnInputClick" >
            <label :class="{ 'not-empty': name.length > 0 }" for="name">Nom d'utilisateur</label>
            <input v-model="name" type="text" />
        </div>
        <div class="input-base" @click="OnInputClick" >
            <label :class="{ 'not-empty': password.length > 0 }" for="pass">Mot de passe</label>
            <input v-model="password" type="password" />
        </div>

        <button class="btn">Valider</button>
    </div>
</template>

<script setup>
    import {ref} from 'vue'
    const activeTab = ref("connect")
    const email = ref("")
    const name = ref("")
    const password = ref("")
    function OnInputClick(event){
        event.preventDefault();
        

        if(event.target.querySelector('input')){
            event.target.querySelector('input').focus();
        }
    }

    function SetTab(tab){
        CallUnreal("test",1,5,{x:5,y:6,z:7});
        activeTab.value = tab;
    }
</script>

<style>
  @import '../../assets/base.css';
</style>
<style scoped>

/* rgb(33, 33, 33) */
/* rgb(66, 66, 66) */
.btn{
    all:unset;
    font-size:1.3em;
    background-color:rgb(33, 33, 33);
    padding:0.3em 1em;
    margin-top:1em;
    border-radius:33px;
    text-transform: uppercase;
    border:2px solid #fff;
    transition: background-color 0.3s ease;
}

.btn:hover{
    background-color:var(--base-blue);
}

.input-base{
    height:50px;
    background-color:rgb(33, 33, 33);
    border-bottom:1px solid rgb(133, 133, 133);
    width:80%;
    margin:0 auto;
    margin-top: 15px;
    position:relative;
}


input{
    all: unset;
    text-align: left;
    position:absolute;
    bottom: 0px;
    left:0px;
    margin-left:5px;
    width:100%;
    height:55%;

}




.input-base:focus-within label {
    top:5px; /* Couleur du label lorsque l'input est focus */
    font-size: 1em;
}

label.not-empty {
    top:5px; /* Couleur du label lorsque l'input est focus */
    font-size: 1em;
}

label{
    position:absolute;
    left:8px;
    top:25%;
    font-size:1.4em;
    z-index:999;
    pointer-events: none;
    transition: top 0.3s ease, font-size 0.3s ease;
    font-weight: 600;
}

#box{
    text-align: center;
    width: 20rem;
    background-color:var(--base-background);
    color:#fff;
    margin:0 auto;
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    border-radius: 10px;
    border:3px solid#e2e2e2;
    overflow: hidden;
    padding-bottom: 1em;
}

.action-menu{
    display: inline-block;
    width:50%;
    height:3em;
    text-align: center;
    background-color: rgb(66, 66, 66);
    border-bottom:2px solid #fff;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-bottom: 10px;
}

.action-menu.active{
    background-color: var(--base-blue);
}

.action-menu:hover{
    
    background-color: var(--base-red);
}

.action-menu:nth-child(1){
    border-right:1px solid #e2e2e2;
}

.action-menu:nth-child(2){
    border-left:1px solid #e2e2e2;
}

.action-menu p{
    font-size:1.2em;
    font-weight:600;
    position:relative;
    top:25%;
}

</style>

