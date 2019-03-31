<template>
	<div class="app">
		<Controlbar/>
		<Requests/>
	</div>
</template>

<script>

	// ✓	<router-link to="/ass">Перейти к Ass</router-link>

	import requests from './requests.vue'
	import controlbar from './controlbar.vue'

	export default {
		components: {
			Requests: requests,
			Controlbar: controlbar
		},
    computed: {
    },
	}

</script>

<style lang="scss">

	@import '../variables.scss';
	@import '../commonstyle.scss';

	//$--color-primary: teal;
	
	.app {
		/*display: flex;
		justify-content: flex-start;
		flex-direction: row;
		align-items: stretch;
		background-color: #fafafa;*/
		width: 100%;
		height: 100%;
	}
</style>