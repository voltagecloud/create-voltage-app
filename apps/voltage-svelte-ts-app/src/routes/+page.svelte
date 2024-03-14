<script lang="ts">
  import { lndGetWalletBalance, lndGetInfo, lndListChannels } from "$lib/lnd";
</script>

<h1>Welcome to your Voltage Application</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the sveltekit
  documentation
</p>

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
