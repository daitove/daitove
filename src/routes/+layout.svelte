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

<header class="relative h-16">
  <a href="/preview" class="absolute left-5 top-2 w-12 h-12">
    <Logo />
  </a>

  <a
    href="/preview"
    style="left: calc(50% - 4.5rem);"
    class="absolute top-5 w-36 text-center italic text-gray-700"
  >
    შინ, ევროპისკენ!
  </a>

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
    class="absolute top-4 right-4 h-8 w-8 text-gray-700"
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
      class="fixed z-40 top-0 left-0 h-screen w-screen flex justify-center items-center bg-black bg-opacity-25"
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
