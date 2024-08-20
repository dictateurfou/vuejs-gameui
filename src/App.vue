<template>
  <component :is="dynamicComponent" />
</template>

<script>
export default{
  inject: ['dynamicComponent'],
  data(){
    return {
      //dynamicComponent:null
    }
  }
}
</script>
