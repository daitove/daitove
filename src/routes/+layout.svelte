<script lang="ts">
  import '../app.css';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';

  type MenuItem = {
    name: string;
    route: string;
  };

  let menuItems: MenuItem[] = [
    { name: 'დამიტოვე', route: '/listing' },
    { name: 'გამიყოლე', route: '/take-me' }
  ];

  const currentRouteStore = writable('');
  currentRouteStore.set(window.location.pathname);
  window.addEventListener('popstate', () => {
    currentRouteStore.set(window.location.pathname);
  });
  const unsubscribe = page.subscribe(() => {
    if ($page) {
      currentRouteStore.set($page.route.id ?? '/');
    }
  });
  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="mt-10">
  <ul class="flex items-center gap-3 p-10 w-full justify-center">
    {#each menuItems as { name, route }}
      <li
        class="border-b cursor-pointer py-1 transition-opacity text-lg text-primary-900 font-bold {$currentRouteStore ===
        route
          ? 'border-success-400'
          : 'border-white opacity-50 hover:border-gray-300'}"
      >
        <button on:click={() => goto(route)}>{name}</button>
      </li>
    {/each}
  </ul>

  <slot />
</div>
