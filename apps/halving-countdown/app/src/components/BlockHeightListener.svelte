<script lang="ts">
  import { blockHeight } from "../stores";
  import { lndGetInfo } from "../lib/lnd";

  $: init();

  function init() {
    setInterval(async () => {
      const { block_height } = await lndGetInfo();
      $blockHeight = block_height;
    }, 1000);
  }
</script>
