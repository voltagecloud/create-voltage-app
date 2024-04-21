<script>
  import { Toast } from "flowbite-svelte";
  import { QuoteOutline } from "flowbite-svelte-icons";
  import { fade } from "svelte/transition";
  import facts from "../lib/facts";

  let open = false;
  let message = pickRandomFact();

  const urlParams = new URLSearchParams(window.location.search);
  const isSponsor = urlParams.has("sponsor");

  function pickRandomFact() {
    return facts[Math.floor(Math.random() * facts.length)];
  }

  function showFact() {
    // Pick random item from array
    message = pickRandomFact();
    open = true;
    setTimeout(() => {
      open = false;
      setTimeout(showFact, 5000);
    }, 8000);
  }
  $: setTimeout(showFact, 5000);
</script>

{#if open && isSponsor}
  <div transition:fade>
    <Toast
      open
      position="top-left"
      dismissable={false}
      color="indigo"
      divClass="w-full fw md:max-w-sm p-4 text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-900 gap-3 text-xs sm:text-sm max-md:mt-10 z-10"
      contentClass="flex space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-700"
    >
      <QuoteOutline
        class="w-4 h-4 sm:w-5 sm:h-5  dark:text-emerald-600 rotate-45"
      />
      <div class="px-4 font-normal max-h-28">{message}</div>
    </Toast>
  </div>
{/if}

{#if open && isSponsor}
  <div transition:fade>
    <Toast
      open
      position="top-left"
      dismissable={false}
      color="indigo"
      divClass="w-full fw md:max-w-sm p-4 text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-900 gap-3 text-xs sm:text-sm max-md:mt-10 z-10"
      contentClass="flex space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-700"
    >
      <QuoteOutline
        class="w-4 h-4 sm:w-5 sm:h-5  dark:text-emerald-600 rotate-45"
      />
      <a href="https://voltage.cloud" class="cursor-pointer" target="_blank">
        <div class="flex flex-col gap-2 px-4">
          <div class="text-sm font-normal">
            <img src="/voltage-logo.png" class="h-6" alt="River Logo" />
          </div>
          <p class="text-sm">
            Voltage provides lightning node infrastructure + a full suite of
            services including our LSP and Surge for node observability. Free 7
            day trial!
          </p>
        </div>
      </a>
    </Toast>
  </div>
{/if}

<style lang="postcss">
  /* Hack to make the Toast component full width on mobile */
  :global(div.fw) {
    @media (max-width: 768px) {
      width: calc(100% - 42px);
    }
  }
</style>
