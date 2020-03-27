<template>
  <div>
    <br />
    <router-link to="/">home</router-link>
    <router-link to="/about">about</router-link>
    <div @click="$router.push('/about')">about push</div>
    <br />
    <router-view />
  </div>
</template>
<script>
export default {
  props: {},

  data() {
    return {}
  },

  computed: {},

  mounted() {},

  methods: {}
}
</script>
<style scoped>
h1 {
  height: 1000px;
}
</style>
