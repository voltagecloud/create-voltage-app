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
	{#if address || invoice}
		<!-- TODO: check if payment succeeded -->
		<QrCode image='https://voltage.imgix.net/Team.png?fm=webp&w=160' {address} {invoice} />
	{/if}
	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="flex flex-1 flex-col gap-4">
			<Card>
				<div class="flex flex-col gap-8">
					<div class="flex flex-col gap-4">
						<h2>Create Invoice</h2>
						<!-- Make a simple form to call the lndCreateInvoices function with the amount and memo -->
						<form class="flex flex-col gap-2" on:submit|preventDefault={createInvoice}>
							<Input id="amount" bind:value={amount} label="Amount" />
							<Input id="memo" bind:value={memo} label="Memo" />
							<Button type="submit">Create Invoice</Button>
						</form>
					</div>
				</div>
			</Card>
			<Card>
				<div class="flex flex-col gap-4">
					<h2>Get New Address</h2>
					<Button type="submit" on:click={getNewAddress}>Get New Address</Button>
				</div>
			</Card>
		</div>
		<div class="max-w-1/2 flex flex-1 flex-col gap-4">
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
			<Card>
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
			</Card>
			<Card>
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
			</Card>

			<Card>
				<h2>Invoices</h2>
				{#await lndListInvoices()}
					<p>loading...</p>
				{:then result}
					<ul class=" max-h-80 max-w-full overflow-y-scroll break-all">
						<!-- catch a dispatched created invoice -->
						{#each result.invoices as invoice}
							<li>{invoice.add_index} - {invoice.state} {invoice.payment_request}</li>
						{/each}
					</ul>
				{/await}
			</Card>
		</div>
	</div>
</div>

<style lang="postcss">
	h2 {
		@apply text-2xl font-bold;
	}
</style>
