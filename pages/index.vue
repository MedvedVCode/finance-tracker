<template>
	<section class="flex items-center justify-between mb-10">
		<h1 class="text-4xl font-extrabold">Summary</h1>
		<div>
			<USelectMenu
				v-model="selectedView"
				:options="transactionViewOptions"
			/>
		</div>
	</section>
	<section
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
	>
		<Trend
			color="green"
			title="Income"
			:amount="incomeTotal"
			:last-amount="prevIncomeTotal"
			:loading="pending"
		></Trend>
		<Trend
			color="red"
			title="Expense"
			:amount="expenseTotal"
			:last-amount="prevExpenseTotal"
			:loading="pending"
		></Trend>
		<Trend
			color="green"
			title="Investments"
			:amount="4000"
			:last-amount="2000"
			:loading="pending"
		></Trend>
		<Trend
			color="red"
			title="Savings"
			:amount="4000"
			:last-amount="4100"
			:loading="pending"
		></Trend>
	</section>

	<section class="flex justify-between mb-10">
		<div>
			<h2 class="text-2xl font-extrabold">Transactions</h2>
			<div class="text-gray-500 dark:text-gray-400">
				You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
				period
			</div>
		</div>
		<div>
			<TransactionModal
				v-model="isOpen"
				@saved="refresh()"
			/>
			<UButton
				icon="i-heroicons-plus-circle"
				color="white"
				variant="solid"
				label="Add"
				@click="isOpen = true"
			/>
		</div>
	</section>

	<section v-if="!pending">
		<div
			v-for="(transactionOfDay, date) in byDate"
			:key="date"
			class="mb-10"
		>
			<DailyTransactionsSummary
				:date="date"
				:transactions="transactionOfDay"
			/>
			<Transaction
				v-for="transaction in transactionOfDay"
				:key="transaction.id"
				:transaction="transaction"
				@deleted="refresh()"
				@edited="refresh()"
			/>
		</div>
	</section>
	<section v-else>
		<USkeleton
			class="h-8 w-full mb-2"
			v-for="i in 4"
			:key="i"
		/>
	</section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';
const user = useSupabaseUser(); 
//set color mode by hands
const colorMode = useColorMode();
colorMode.preference = 'dark';

const isOpen = ref(false);
const selectedView = ref(user.value.user_metadata?.transaction_view ?? transactionViewOptions[1]);

const { current, previous } = useSelectedTimePeriod(selectedView);

const {
	pending,
	refresh,
	transactions: {
		incomeCount,
		expenseCount,
		incomeTotal,
		expenseTotal,
		grouped: { byDate },
	},
} = useFetchTransactions(current);
await refresh();

const {
	refresh: refreshPrevious,
	transactions: {
		incomeTotal: prevIncomeTotal,
		expenseTotal: prevExpenseTotal,
	},
} = useFetchTransactions(previous);
await refreshPrevious();
</script>
