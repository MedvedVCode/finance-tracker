<template>
	<section class="flex items-center justify-between mb-10">
		<h1 class="text-4xl font-extrabold">Summary</h1>
		<div>
			<USelectMenu
				:v-model="selectedView"
				:options="transactionView"
			/>
		</div>
	</section>
</template>

<script setup>
const transactionView = ['Yearly', 'Monthly', 'Weekly'];
const selectedView = ref(transactionView[1]);
</script>

<style lang="scss" scoped></style>
