<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header>
				<h3>{{ isEditing ? 'Edit' : 'Add' }} Transaction</h3>
			</template>

			<UForm
				:state="state"
				:schema="schema"
				ref="form"
				@submit.prevent="save"
			>
				<UFormGroup
					:required="true"
					label="Transation type"
					name="type"
					class="mb-4"
				>
					<USelect
						:disabled="isEditing"
						:options="types"
						placeholder="Select the Transaction types"
						v-model="state.type"
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
						v-model.number="state.amount"
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
						v-model="state.created_at"
					/>
				</UFormGroup>

				<UFormGroup
					label="Description"
					hint="optional"
					name="description"
					class="mb-4"
				>
					<UInput
						placeholder="Description"
						v-model="state.description"
					/>
				</UFormGroup>

				<UFormGroup
					:required="true"
					label="Category"
					name="category"
					class="mb-4"
					v-if="state.type === 'Expense'"
				>
					<USelect
						:options="categories"
						placeholder="Categories"
						v-model="state.category"
					/>
				</UFormGroup>

				<UButton
					type="submit"
					color="black"
					variant="solid"
					label="Save"
					:loading="isLoading"
					block
				/>
			</UForm>
		</UCard>
	</UModal>
</template>

<script setup>
import { categories, types } from '~/constants';
import { z } from 'zod';

const props = defineProps({
	modelValue: Boolean,
	transaction: {
		type: Object,
		required: false,
	},
});
const isEditing = computed(() => !!props.transaction);
const emits = defineEmits(['update:modelValue', 'saved']);

const defaultSchema = z.object({
	amount: z.number().positive('Amount must be more than 0'),
	created_at: z.string(),
	description: z.string().optional(),
});

const incommeSchema = z.object({
	type: z.literal('Income'),
});
const expenseSchema = z.object({
	type: z.literal('Expense'),
	category: z.enum(categories),
});
const investmentSchema = z.object({
	type: z.literal('Investment'),
});
const savingSchema = z.object({
	type: z.literal('Saving'),
});

const schema = z.intersection(
	z.discriminatedUnion('type', [
		incommeSchema,
		expenseSchema,
		investmentSchema,
		savingSchema,
	]),
	defaultSchema
);

const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

const save = async () => {
	// form.value.validate();
	if (form.value.errors.length) return;
	try {
		isLoading.value = true;
		const { error } = await supabase
			.from('transactions')
			.upsert({ ...state.value, id: props.transaction?.id });
		if (!error) {
			toastSuccess({
				title: 'Transaction saved',
			});
			isOpen.value = false;
			emits('saved');
			return;
		}
		throw error;
	} catch (err) {
		toastError({
			title: 'Transaction save error',
			description: err.message,
		});
	} finally {
		isLoading.value = false;
	}
};

const initialState = isEditing.value
	? {
			type: props.transaction.type,
			amount: props.transaction.amount,
			created_at: props.transaction.created_at.split('T')[0],
			description: props.transaction.description,
			category: props.transaction.category,
	  }
	: {
			type: undefined,
			amount: 0,
			created_at: undefined,
			description: undefined,
			category: undefined,
	  };

const state = ref({ ...initialState });

const resetForm = () => {
	Object.assign(state.value, initialState);
	form.value.clear();
};

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => {
		if (!value) resetForm();
		emits('update:modelValue', value);
	},
});
</script>
