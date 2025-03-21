<script lang="ts">
  import { toggleFullscreen } from "../lib/fullscreen";
  import { isFullScreen } from "../stores";
</script>

{#if document.fullscreenEnabled}
  <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
  <span
    class="hover:cursor-pointer"
    on:click={() => toggleFullscreen($isFullScreen)}
  >
    {#if $isFullScreen}
      <img src="/exit-fullscreen.svg" class="h-4 sm:h-5" alt="fullscreen" />
    {:else}
      <img src="/fullscreen.svg" class="h-4 sm:h-5" alt="exit fullscreen" />
    {/if}
  </span>
{/if}
