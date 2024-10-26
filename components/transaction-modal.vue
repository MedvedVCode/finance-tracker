<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header>
				<h3>Add Transaction</h3>
			</template>

			<UFormGroup
				:required="true"
				label="Transation type"
				name="type"
				class="mb-4"
			>
				<USelect
					:options="types"
					placeholder="Select the Transaction types"
				/>
			</UFormGroup>

			<UFormGroup
				label="Amount"
				:required="true"
				name="amount"
				class="mb-4"
			>
				<UInput
					type="number"
					placeholder="Amount"
				/>
			</UFormGroup>

			<UFormGroup
				label="Transaction date"
				:required="true"
				name="created_at"
				class="mb-4"
			>
				<UInput
					type="date"
					icon="i-heroicons-calendar-20-solid"
				/>
			</UFormGroup>

			<UFormGroup
				label="Description"
				hint="optional"
				name="description"
				class="mb-4"
			>
				<UInput placeholder="Description" />
			</UFormGroup>

			<UFormGroup
				:required="true"
				label="Category"
				name="category"
				class="mb-4"
			>
				<USelect
					:options="categories"
					placeholder="Categories"
				/>
			</UFormGroup>

			<UButton
				type="submit"
				color="black"
				variant="solid"
				label="Save"
				block
			/>
		</UCard>
	</UModal>
</template>

<script setup>
import { categories, types } from '~/constants';

const props = defineProps({
	modelValue: Boolean,
});
const emits = defineEmits(['update:modelValue']);

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => emits('update:modelValue', value),
});
</script>
