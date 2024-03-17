<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	export let parameters = '';
	export let address = '';
	export let invoice = '';
	export let imgSrc = './assets/voltage.svg';
	export let moduleColor = '#ff5000';
	export let positionCenterColor = '#cc4100';
	export let positionRingColor = '#9f3200';
	export let isPolling = false;
	export let interval = 3000; // Interval to poll in milliseconds
	export let pollCallback = () => {}; // FIXME: allow undefined without breaking TS
	export let clazz = '';

	onMount(() => {
		const qr = document.getElementById('qr') as any;
		if (qr) {
			qr.addEventListener('codeRendered', () => {
				qr.callback = pollCallback;
				qr.animateQRCode('MaterializeIn');
			});
		}
	});

	onDestroy(() => {
		const qr = document.getElementById('qr') as any;
		if (qr) {
			qr.removeEventListener('codeRendered', () => {
				qr.callback = undefined;
			});
		}
	});
</script>

<svelte:head>
	<script
		type="module"
		src="https://unpkg.com/bitcoin-qr@1.0.0/dist/bitcoin-qr/bitcoin-qr.esm.js"
	></script>
	<script src="https://unpkg.com/@bitjson/qr-code@1.0.2/dist/qr-code.js"></script>
</svelte:head>

{#if browser}
	<bitcoin-qr
		id="qr"
		class={clazz}
		bitcoin={address}
		lightning={invoice}
		{parameters}
		module-color={moduleColor}
		position-center-color={positionCenterColor}
		position-ring-color={positionRingColor}
		img-src={imgSrc}
		is-polling={isPolling}
		{interval}
	/>
{/if}
