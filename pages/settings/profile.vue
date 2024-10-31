<template>
	<UForm
		:state="state"
		:schema="schema"
		@submit.prevent="saveProfile"
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
		<UButton
			type="submit"
			variant="solid"
			color="black"
			:loading="pending"
			:disabled="pending"
			label="Save"
		/>
	</UForm>
</template>

<script setup>
import { z } from 'zod';
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const state = ref({
	name: user.value.user_metadata?.full_name,
	email: user.value.email,
});
const schema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email(),
});

const saveProfile = async () => {
	pending.value = true;

	try {
		const data = {
			data: {
				full_name: state.value.name,
			},
		};

		if (state.value.email !== user.value.email) {
			data.email = state.value.email;
		}

		const { error } = await supabase.auth.updateUser(data);

		if (error) throw error;

		toastSuccess({
			title: 'Profile updated',
			description: 'Your profile has been updated',
		});
	} catch (error) {
		toastError({
			title: 'Error updating profile',
			description: error.message,
		});
	} finally {
		pending.value = false;
	}
};
</script>
