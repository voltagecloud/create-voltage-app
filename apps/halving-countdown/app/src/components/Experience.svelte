<script lang="ts">
  import { Spinner } from "flowbite-svelte";
  import { fade } from "svelte/transition";

  export let blockHeight: number = 0;
  export let target: number = 0;

  $: remainingBlocks = target - blockHeight;

  $: estimatedHalvingDate = new Date(
    new Date().getTime() + (remainingBlocks || 0) * 10 * 60 * 1000
  ).toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });
</script>

<div class="z-20">
  {#if blockHeight === 0}
    <div class="absolute inset-0 flex items-center justify-center">
      <Spinner color="white" />
    </div>
  {:else}
    <slot />
    {#if !!remainingBlocks}
      <div transition:fade class="max-w-4xl w-full">
        <div class="flex flex-col gap-4 lg:gap-8 items-center justify-center">
          <div class="w-16 md:w-20 lg:w-32">
            <img
              alt="bitcoin"
              class="object-cover animate-pulse"
              src={"/bitcoin-white.png"}
            />
          </div>
          <h1 class="text-3xl md:text-4xl lg:text-6xl text-center">
            {remainingBlocks} block{remainingBlocks == 1 ? "" : "s"} remaining
          </h1>
          <div class="flex flex-col gap-1 md:gap-2 lg:gap-4 items-center">
            <span class="dark:text-gray-400 text-lg md:text-xl lg:text-4xl"
              >Current block height: {blockHeight}</span
            >
            <span class="dark:text-gray-500 text-sm md:text-md lg:text-2xl"
              >Halving block height: {target}</span
            >
            <span
              class="font-bold underline dark:text-gray-500 text-xs lg:text-sm"
              >Estimated halving date:</span
            >
            <span class="dark:text-gray-500 text-xs lg:text-sm"
              >{estimatedHalvingDate}</span
            >
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
