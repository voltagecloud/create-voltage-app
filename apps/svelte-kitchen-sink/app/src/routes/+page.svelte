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
	import { ArrowUpRight, ArrowDownLeft } from 'lucide-svelte';
	import Toast from '$components/Toast/Toast.svelte';

	let amount = 0;
	let memo = '';
	let invoice = '';
	let address = '';
	let info: GetInfoResponse;

	let showToast = false;
	let toastMessage = '';

	const getNewAddress = async () => {
		address = (await lndNewAddress()).address;
	};

	const createInvoice = async () => {
		invoice = (await lndCreateInvoice(amount, memo)).payment_request;
	};

	const getInfo = async () => {
		info = await lndGetInfo();
	};

	const copyAddress = () => {
		navigator.clipboard.writeText(address);
		toastMessage = 'Address copied to clipboard!';
		showToast = true;
	};

	onMount(async () => {
		await getInfo();
	});
</script>

<div class="mx-8 flex flex-col items-center">
	<div class="flex items-center gap-2">
		<img src="/assets/voltage-name.svg" alt="Voltage" class="w-[250px]" />
		{#if info?.chains?.length}
			<NetworkCapsule network={info.chains[0].network} />
		{/if}
	</div>
	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="flex flex-1 flex-col gap-4">
			<Card title="Create Invoice">
				<form class="flex flex-col gap-4" on:submit|preventDefault={createInvoice}>
					<Input id="amount" bind:value={amount} label="Amount" />
					<Input id="memo" bind:value={memo} label="Memo" />
					<Button type="submit">Create Invoice</Button>
				</form>
			</Card>
			<Card title="Get New OnChain Address">
				<div class="flex flex-col gap-4">
					<Button type="button" on:click={getNewAddress}>Get New Address</Button>
					
					{#if address || invoice}
						<div class="flex flex-col gap-4 items-center mt-4">
							<QrCode image="https://voltage.imgix.net/Team.png?fm=webp&w=160" {address} {invoice} />
							<Button type="button" on:click={copyAddress}>Copy Address</Button>
						</div>
					{/if}
				</div>
			</Card>
		</div>
		<div class="max-w-1/2 flex flex-1 flex-col gap-4">
			<Card title="Node Balance">
				{#await lndGetWalletBalance()}
					<p class="text-gray-500">Loading...</p>
				{:then result}
					<ul class="space-y-2">
						<li><span class="font-semibold">Total Balance:</span> {result.total_balance}</li>
						<li><span class="font-semibold">Confirmed Balance:</span> {result.confirmed_balance}</li>
						<li><span class="font-semibold">Unconfirmed Balance:</span> {result.unconfirmed_balance}</li>
					</ul>
				{:catch error}
					<p class="text-red-500">Error: {error.message}</p>
				{/await}
			</Card>
			
			<Card title="Node Info">
				{#await lndGetInfo()}
					<p class="text-gray-500">Loading...</p>
				{:then result}
					<ul class="space-y-2">
						<li><span class="font-semibold">Node Alias:</span> {result.alias}</li>
						<li><span class="font-semibold">Pubkey:</span> <span class="break-all">{result.identity_pubkey}</span></li>
						<li><span class="font-semibold">Peers:</span> {result.num_peers}</li>
						<li><span class="font-semibold">Synced to Chain:</span> {result.synced_to_chain ? 'Yes' : 'No'}</li>
					</ul>
				{:catch error}
					<p class="text-red-500">Error: {error.message}</p>
				{/await}
			</Card>
			
			<Card title="Channel Info">
				{#await lndListChannels()}
					<p class="text-gray-500">Loading...</p>
				{:then result}
					<p><span class="font-semibold">Number of channels:</span> {result.channels.length}</p>
				{:catch error}
					<p class="text-red-500">Error: {error.message}</p>
				{/await}
			</Card>

			<Card title="Invoices">
				{#await lndListInvoices()}
					<p class="text-gray-500">Loading...</p>
				{:then result}
					<ul class="max-h-80 overflow-y-auto space-y-2">
						{#each result.invoices.reverse() as invoice}
							<li class="break-all flex flex-col gap-2 border-b-2 border-gray-400 pb-2">
								<div class="flex items-center gap-2">
									{#if invoice.settled}
										<ArrowDownLeft class="text-green-600" size={16} />
									{:else if invoice.state === 'CANCELED'}
										<ArrowUpRight class="text-red-500" size={16} />
									{:else}
										<ArrowUpRight class="text-yellow-500" size={16} />
									{/if}
									<span class={invoice.state === 'SETTLED' ? 'text-green-600' : 'text-red-500'}>{invoice.state}</span>
								</div>
								<span class="font-semibold">{invoice.value} sats</span>
								<span class="text-sm text-gray-600">{invoice.payment_request}</span>
								<span class="text-xs text-gray-600">{new Date(Number(invoice.creation_date) * 1000).toLocaleString()}</span>
							</li>
						{/each}
					</ul>
				{:catch error}
					<p class="text-red-500">Error: {error.message}</p>
				{/await}
			</Card>
		</div>
	</div>
	<Toast bind:show={showToast} message={toastMessage} />
</div>