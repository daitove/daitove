<script lang="ts">
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import type { User } from 'firebase/auth';

  import SignInForm from '$lib/components/SignInForm.svelte';
  import { auth } from '$lib/firebase';

  let showSignInForm = false;
  let user: User | null = null;

  onAuthStateChanged(auth, (usr) => {
    user = usr;
  });
</script>

{#if user === null}
  <SignInForm bind:showSignInForm />
  <button on:click={() => (showSignInForm = true)}>შესვლა</button>
{:else}
  <button on:click={() => signOut(auth)}>გამოსვლა</button>
{/if}
