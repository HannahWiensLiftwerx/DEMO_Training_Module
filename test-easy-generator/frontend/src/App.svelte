<script>
  import svelteLogo from './assets/svelte.svg';
  import viteLogo from '/vite.svg';
  import Counter from './lib/Counter.svelte';

  let launchUrl = '';
  let regId = '';
  let completed = false; // Missing declaration added
  let interval;

  async function launchCourse() {
    try {
      const res = await fetch('http://localhost:3000/api/get-launch-link?learnerId=test');
      if (!res.ok) throw new Error('Failed to get launch URL');
      const data = await res.json();
      launchUrl = data.launchUrl;
      regId = data.regId;
      pollForCompletion();
    } catch (error) {
      console.error(error);
      alert('Could not launch course');
    }
  }

  async function checkCompletion() {
    const res = await fetch('http://localhost:3000/api/check-completion?learnerId=test&regId=${regId}');
    const data = await res.json();
    if (data.completed) {
      completed = true;
      clearInterval(interval);
    }
  }

  function pollForCompletion() {
    interval = setInterval(checkCompletion, 10000); // every 10 seconds
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
  <div class=circle class:completed={completed}></div>

  <div class="card">
    <Counter />
  </div>

</main>

<style>
  .circle {
    width: 100px;
    height: 100px;
    background-color: red;
    border-radius: 50%;
  }
  .circle.completed {
    background-color: green;
  }

</style>
