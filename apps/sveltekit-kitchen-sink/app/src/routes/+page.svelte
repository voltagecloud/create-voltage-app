<script lang="ts">
	import {
		lndGetWalletBalance,
		lndGetInfo,
		lndListChannels,
		lndListInvoices,
		lndCreateInvoice,
		lndNewAddress,
		type GetInfoResponse
	} from '$lib/lnd';
	import { onMount } from 'svelte';
	import QrCode from '$components/QrCode/QrCode.svelte';
	import Button from '$components/Button/Button.svelte';
	import Input from '$components/Input/Input.svelte';
	import NetworkCapsule from '../features/NetworkCapsule/NetworkCapsule.svelte';
	import Card from '$components/Card/Card.svelte';

	let amount = 0;
	let memo = '';
	let invoice = '';
	let address = '';
	let info: GetInfoResponse;

	const getNewAddress = async () => {
		address = (await lndNewAddress()).address;
	};

	const createInvoice = async () => {
		invoice = (await lndCreateInvoice(amount, memo)).payment_request;
	};

	const getInfo = async () => {
		info = await lndGetInfo();
	};

	onMount(async () => {
		await getInfo();
	});
</script>

<div class="mx-8 flex flex-col items-center">
	<div class="flex items-center gap-2">
		<img src="/assets/voltage-name.svg" alt="Voltage" class="w-[400px]" />
		{#if info?.chains?.length}
			<NetworkCapsule network={info.chains[0].network} />
		{/if}
	</div>
	<!-- TODO: voltage documentation -->

	<div class="flex">
		<div class="max-w-1/2 flex-1">
			{#if info?.chains?.length}
				<p>Network: {info.chains[0].network}</p>
			{/if}

			<Card>
				<h2>Node Balance</h2>
				{#await lndGetWalletBalance()}
					<p>loading...</p>
				{:then result}
					<ul>
						<li>Total Balance: {result.total_balance}</li>
						<li>Confirmed Balance: {result.confirmed_balance}</li>
						<li>Unconfirmed Balance: {result.unconfirmed_balance}</li>
					</ul>
				{:catch error}
					<p>error: {error.message}</p>
				{/await}
			</Card>

			<h2>Node Info</h2>
			{#await lndGetInfo()}
				<p>loading...</p>
			{:then result}
				<ul>
					<li>Node Alias: {result.alias}</li>
					<li>Pubkey: {result.identity_pubkey}</li>
					<li>Peers: {result.num_peers}</li>
					<li>Synced to Chain: {result.synced_to_chain}</li>
				</ul>
			{:catch error}
				<p>error: {error.message}</p>
			{/await}

			<h2>Channel Info</h2>
			{#await lndListChannels()}
				<p>loading...</p>
			{:then result}
				<ul>
					<li>Number of channels: {result.channels.length}</li>
				</ul>
			{:catch error}
				<p>error: {error.message}</p>
			{/await}

			<h2>Channel Info</h2>
			{#await lndListChannels()}
				<p>loading...</p>
			{:then result}
				<ul>
					<li>Number of channels: {result.channels.length}</li>
				</ul>
			{:catch error}
				<p>error: {error.message}</p>
			{/await}

			<h2>Invoices</h2>
			{#await lndListInvoices()}
				<p>leading...</p>
			{:then result}
				<ul class=" max-w-full break-all">
					<!-- catch a dispatched created invoice -->
					{#each result.invoices as invoice}
						<li>{invoice.add_index} - {invoice.state} {invoice.payment_request}</li>
					{/each}
				</ul>
			{/await}
		</div>
		<div class="flex flex-1 flex-col gap-4 bg-green-100">
			<h2>Create Invoice</h2>
			<!-- Make a simple form to call the lndCreateInvoices function with the amount and memo -->
			<form class="flex flex-col" on:submit|preventDefault={createInvoice}>
				<Input id="amount" bind:value={amount} label="Amount" />
				<Input id="memo" bind:value={memo} label="Memo" />
				<Button type="submit">Create Invoice</Button>
			</form>

			<Button type="submit" on:click={getNewAddress}>Get New Address</Button>
			{#if address || invoice}
				<!-- TODO: check if payment succeeded -->
				<QrCode {address} {invoice} />
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	h2 {
		@apply text-2xl font-bold;
	}
</style>
