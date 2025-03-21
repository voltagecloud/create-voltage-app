<script lang="ts">
  import { blockHeight, hasInteracted, isFullScreen } from "./stores";
  import { toggleFullscreen } from "./lib/fullscreen";
  import EpochExperience from "./components/EpochExperience.svelte";
  import InfoModal from "./components/InfoModal.svelte";
  import BlockHeightListener from "./components/BlockHeightListener.svelte";

  $: $hasInteracted && toggleFullscreen(false);

  function handleFullScreenChange() {
    if (document.fullscreenElement) {
      $isFullScreen = true;
    } else {
      $isFullScreen = false;
    }
  }
</script>

<svelte:window on:fullscreenchange={handleFullScreenChange} />

<BlockHeightListener />
<InfoModal />
<main
  class="relative flex justify-center items-center bg-black dark:text-white"
>
  <!-- Change the blockheight to experiment the approach to the halving -->
  <EpochExperience blockHeight={$blockHeight} />
</main>
