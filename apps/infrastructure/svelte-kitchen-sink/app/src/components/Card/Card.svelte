<script lang="ts">
  export let title: string | undefined = undefined;
</script>

<div class="rounded-xl bg-white p-4 shadow-md">
  {#if title}
    <h2 class="text-2xl font-bold mb-4">{title}</h2>
  {/if}
  <slot />
</div>