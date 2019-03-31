<template>
	<div class="app">
		<Callboard/>
		<Questions/>
		<Answer/>
	</div>
</template>

<script>

	// ✓	<router-link to="/ass">Перейти к Ass</router-link>

	import questions from './questions.vue'
	import callboard from './callboard.vue'
	import answer from './answer.vue'

	export default {
		components: {
			Questions: questions,
			Callboard: callboard,
			Answer: answer
		}
	}

</script>

<style lang="scss">

	@import '../variables.scss';
	@import '../commonstyle.scss';

	//$--color-primary: teal;
	
	.app {
		display: flex;
		justify-content: flex-start;
		flex-direction: row;
		align-items: stretch;/*
		background-color: #fafafa;*/
		width: 100%;
		height: 100%;
	}
</style>