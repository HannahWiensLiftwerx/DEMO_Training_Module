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
  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
