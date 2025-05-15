<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  let launchUrl = '';

  async function launchCourse() {
    try {
      const res = await fetch('http://localhost:3000/api/get-launch-link?learnerId=test');
      if (!res.ok) throw new Error('Failed to get launch URL');
      const data = await res.json();
      launchUrl = data.launchUrl;
    } catch (error) {
      console.error(error);
      alert('Could not launch course');
    }
  }
</script>
<button on:click={launchCourse}>
  Launch Course
</button>
{#if launchUrl}
  <iframe
    src={launchUrl}
    width="100%"
    height="600"
    style="border: none;"
    title="SCORM Course Content"
  ></iframe>
{/if}
<main>
  <div class="circle"></div>

  <div class="card">
    <Counter />
  </div>

</main>

<style>
  .circle {
    width: 100px;
    height: 100px;
    background-color: #008000;
    border-radius: 50%;
  }
  .read-the-docs {
    color: #888;
  }
</style>
