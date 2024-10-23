<template>
	<div>
			<UModal v-model="isOpen">
				<UCard>
					<template #header>
						<h3>Add Transaction</h3>
					</template>
					<div>
						Hello!
					</div>
				</UCard>
			</UModal>
			<UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
		</div>
</template>

<script setup>
const isOpen = ref(false);
</script>