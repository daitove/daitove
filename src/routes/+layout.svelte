<script lang="ts">
  import '../app.css';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

  import { auth } from '$lib/firebase';
  import IconUser from '$lib/components/icons/IconUser.svelte';
  import SignInForm from '$lib/components/forms/SignInForm.svelte';
  import IconSignOut from '$lib/components/icons/IconSignOut.svelte';
  import Logo from '$lib/components/Logo.svelte';

  let user: User | null = null;
  let showSignInForm = false;

  onAuthStateChanged(auth, (usr) => (user = usr));
</script>

<header class="flex items-center justify-between px-4 py-2">
  <a href="/preview" class="w-12 h-12">
    <Logo />
  </a>

  <a href="/preview" class="italic text-center text-gray-700 w-36">შინ, ევროპისკენ!</a>

  <a
    href="/profiles/{user?.uid}"
    on:click={(e) => {
      if (!user) {
        e.preventDefault();
        showSignInForm = true;
      } else if ($page.url.pathname === `/profiles/${user.uid}`) {
        e.preventDefault();
        signOut(auth);
        goto('/preview');
      }
    }}
    class="w-8 h-8 text-gray-700 fx-click group"
  >
    {#if user && $page.url.pathname === `/profiles/${user.uid}`}
      <IconSignOut />
    {:else}
      <IconUser />
    {/if}
  </a>

  {#if showSignInForm}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="fixed top-0 left-0 z-40 flex items-center justify-center w-screen h-screen bg-black bg-opacity-25"
      on:click={(e) => {
        showSignInForm = false;
        e.stopPropagation();
      }}
    >
      <SignInForm
        on:signin={(e) => {
          showSignInForm = false;
          goto(`/profiles/${e.detail.uid}`);
        }}
      />
    </div>
  {/if}
</header>

<slot />
