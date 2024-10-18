<script lang="ts">
  import { fade } from 'svelte/transition';
  export let message: string;
  export let duration = 3000;
  export let show = false;

  $: if (show) {
    setTimeout(() => {
      show = false;
    }, duration);
  }
</script>

{#if show}
  <div
    transition:fade
    class="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg"
  >
    {message}
  </div>
{/if}
