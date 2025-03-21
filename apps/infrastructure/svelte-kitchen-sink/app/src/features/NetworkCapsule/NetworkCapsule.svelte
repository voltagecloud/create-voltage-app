<script lang="ts">
	import { Network } from '$lib/lnd';

	export let network: Network;

	function getColorFromNetwork(network: Network) {
		switch (network) {
			case Network.MAINNET:
				return 'bg-[#F7931A]';
			case Network.TESTNET:
				return 'bg-cyan-300 text-cyan-800';
			case Network.SIGNET:
				return 'bg-pink-300 text-pink-800';
			default:
				return 'bg-gray-500';
		}
	}

	$: color = getColorFromNetwork(network);
</script>

<div class={`rounded-2xl p-2 ${color}`}>
	{network.toUpperCase()}
</div>
