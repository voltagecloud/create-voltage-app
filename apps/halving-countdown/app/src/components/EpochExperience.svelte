<script lang="ts">
  import Experience from "./Experience.svelte";
  import Portal from "svelte-portal";
  import Video from "./Video.svelte";
  import Audio from "./Audio.svelte";
  import videos from "../lib/videos";
  import Header from "./Header.svelte";

  export let blockHeight = 0;

  $: nextHalvingTarget = calculateNextHalvingTarget(blockHeight);

  function calculateNextHalvingTarget(bh: number) {
    const halvingInterval = 210000;
    const halvingsPassed = Math.floor(bh / halvingInterval);
    return (halvingsPassed + 1) * halvingInterval;
  }
</script>

<Experience {blockHeight} target={nextHalvingTarget}>
  <Header />
  <Audio src="/earth-sfx.mp3" />
  <Portal>
    <Video src={videos.earth} dark loop muted playbackRate={0.5} />
  </Portal>
</Experience>
