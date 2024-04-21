<script>
  import { Button, Modal } from "flowbite-svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { hasInteracted, showInfoModal } from "../stores";

  const urlParams = new URLSearchParams(window.location.search);
  const isReplay = urlParams.has("replay");

  function handleCloseInfo() {
    $hasInteracted = true;
    $showInfoModal = false;
  }
</script>

<!-- Interaction Modal: DO NOT MAKE THIS DISMISSABLE -->
<Modal open={!$hasInteracted || $showInfoModal} backdropClass="bg-black">
  {#if isReplay}
    <h1 class="text-2xl font-bold text-center">REPLAY INFORMATION</h1>
    <p>
      This is a replay of the Bitcoin 4th halving experience with 6 blocks
      remaining and 5 minute block time. Expect the full experience to last ~ 45
      minutes, otherwise:
    </p>
    <ul class="list-disc ml-5">
      <li>
        Increment block height with SPACE key or by tapping the bitcoin logo.
      </li>
      <li>Next / previous music video with RIGHT / LEFT key.</li>
      <li>Skip ahead / back music video track with g / h key.</li>
    </ul>
    <p></p>
  {:else}
    <h1 class="text-2xl font-bold text-center">Welcome</h1>
    <p>
      This is a simplified version of the original countdown at <a
        class="text-blue-500 underline"
        href="https://bitcoinhalving.club">bitcoinhalving.club</a
      > originally built for the 2024 halving. It doesn't include all the necessary
      backend server and code to make this a deployable application but it showcases
      connecting to your LND node at voltage to get the block height and you can
      use it as a base to build your own countdown app.
    </p>
  {/if}
  <div class="py-2">
    <Button color="blue" size="lg" class="w-full" on:click={handleCloseInfo}
      >READY</Button
    >
  </div>
</Modal>
