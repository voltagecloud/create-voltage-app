<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { VoltagePayments } from 'voltage-payments-component';
	import {
		PUBLIC_VOLTAGE_API_KEY,
		PUBLIC_VOLTAGE_ENVIRONMENT_ID,
		PUBLIC_VOLTAGE_ORGANIZATION_ID,
		PUBLIC_VOLTAGE_WALLET_ID,
		PUBLIC_VOLTAGE_BASE_URL
	} from '$env/static/public';

	onMount(() => {
		const baseUrl = dev ? '/api/voltage' : PUBLIC_VOLTAGE_BASE_URL || 'https://voltageapi.com/v1';
		const payment = VoltagePayments.create({
			baseUrl,
			apiKey: PUBLIC_VOLTAGE_API_KEY,
			walletId: PUBLIC_VOLTAGE_WALLET_ID,
			amount: 1000,
			currency: 'btc',
			organizationId: PUBLIC_VOLTAGE_ORGANIZATION_ID,
			environmentId: PUBLIC_VOLTAGE_ENVIRONMENT_ID,
			paymentKind: 'bip21',
			variant: 'inline',
			onSuccess(payment) {
				console.log('Payment successful', payment);
			},
			onError(error) {
				console.error('Payment error', error);
			}
		});

		payment.mount('#payment');
	});
</script>

<div id="payment"></div>
