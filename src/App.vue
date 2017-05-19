<template>
  <div id="app">
	<transition name="fade"
	            mode="out-in">
		<router-view></router-view>
	</transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped>
*{padding:0;margin:0}
body {
	position: static !important; 
	border: 0;
	margin: 0;
}
</style>
