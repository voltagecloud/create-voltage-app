<script lang="ts">
  import {
    lndGetWalletBalance,
    lndGetInfo,
    lndListChannels,
    lndListInvoices,
    lndCreateInvoice,
    lndNewAddress,
    type GetInfoResponse
  } from "$lib/lnd";
  import { onMount } from "svelte";
  // import QrCode from "$components/QrCode";
  import QrCode from "../components/QrCode/QrCode.svelte";

  let amount = 0;
  let memo = "";
  let invoice = "";
  let address = "";
  let info: GetInfoResponse;

  const getNewAddress = async () => {
    address = (await lndNewAddress()).address;
  };

  const createInvoice = async () => {
    invoice = (await lndCreateInvoice(amount, memo)).payment_request;
  };

  const getInfo = async () => {
     info = await lndGetInfo();
     console.log({info})
  };

  onMount(async () => {
    await getInfo();
  })
</script>

<h1>Welcome to your Voltage Application</h1>
<!-- TODO: voltage documentation -->

<h2>Create Invoice</h2>
<!-- Make a simple form to call the lndCreateInvoices function with the amount and memo -->
<form on:submit|preventDefault={createInvoice}>
  <label for="amount">Amount</label>
  <input type="number" id="amount" bind:value={amount} />
  <label for="memo">Memo</label>
  <input type="text" id="memo" bind:value={memo} />
  <button type="submit">Create Invoice</button>
</form>

<!-- Call the lndNewAddress function and show QrCode -->
<form on:submit|preventDefault={getNewAddress}>
  <button type="submit">Get New Address</button>
</form>

{#if address || invoice}
  <QrCode {address} {invoice} />
{/if}

{#if info?.chains?.length}
  <p>Network: {info.chains[0].network}</p>
{/if}

{#await lndNewAddress()}
  <p>loading...</p>
{:then result}
  <p>Address: {result.address}</p>
{:catch error}
  <p>error: {error.message}</p>
{/await}

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
  <ul>
    <!-- catch a dispatched created invoice -->

    {#each result.invoices as invoice}
      <li>{invoice.add_index} - {invoice.state} {invoice.payment_request}</li>
    {/each}
  </ul>
{/await}

