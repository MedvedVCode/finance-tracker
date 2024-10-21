export const useCurrency = (amount) => {
	const currency = computed(() => {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(isRef(amount) ? amount.value : amount);
	});
	return {
		currency,
	};
};
