<template>
	<UForm
		:state="state"
		:schema="schema"
	>
		<UFormGroup
			class="mb-4"
			label="Full name"
			name="name"
		>
			<UInput v-model="state.name" />
		</UFormGroup>
		<UFormGroup
			class="mb-4"
			label="Email"
			name="email"
			help="You will receive an email to verify your account with link"
		>
			<UInput v-model="state.email" />
		</UFormGroup>
	</UForm>
	<UButton
		type="submit"
		variant="solid"
		color="black"
		:loading="pending"
		label="Save"
	/>
</template>

<script setup>
import { z } from 'zod';
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const state = ref({
	name: '',
	email: user.value.email,
});
const schema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email(),
});
</script>
