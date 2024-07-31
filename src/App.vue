<template>
  <component :is="this.dynamicComponent" />
</template>

<script>
export default{
  data(){
    return {
      dynamicComponent:null
    }
  }
}
</script>
