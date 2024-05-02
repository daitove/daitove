<script lang="ts">
  import { onAuthStateChanged, type User } from 'firebase/auth';
  import { addDoc, collection, Timestamp } from 'firebase/firestore/lite';

  import { auth, firestore } from '$lib/firebase';
  import { filterNumericInput, filterTextInput } from '$lib/filters';
  import SignInForm from '$lib/components/SignInForm.svelte';

  export let showGaikoleForm: boolean;

  let user: User | null = null;
  let departurePoint: string = '';
  let numberOfPeople: string = '';
  let departureTime: string = '';

  onAuthStateChanged(auth, (usr) => (user = usr));

  async function publish() {
    addDoc(collection(firestore, 'gaikole'), {
      authorUid: auth.currentUser!.uid,
      authorName: auth.currentUser!.displayName?.split(' ')[0],
      phoneNumber: auth.currentUser!.phoneNumber,
      departurePoint: departurePoint.trim(),
      numberOfPeople: parseInt(numberOfPeople),
      departureTime: Timestamp.fromDate(new Date(departureTime))
    });

    showGaikoleForm = false;
    departurePoint = '';
    numberOfPeople = '';
    departureTime = '';
  }
</script>

{#if user === null}
  <SignInForm showSignInForm={showGaikoleForm} />
{:else if showGaikoleForm}
  <form>
    <label for="departure-point">საიდან მიემგზავრებით?</label>
    <input
      id="departure-point"
      type="text"
      placeholder="ბათუმი"
      minlength="3"
      maxlength="32"
      on:input={filterTextInput}
      bind:value={departurePoint}
    />

    <label for="number-of-people">რამდენ ადამიანს გაიყოლებთ?</label>
    <input
      id="number-of-people"
      inputmode="numeric"
      type="text"
      placeholder="4"
      minlength="1"
      maxlength="2"
      on:input={filterNumericInput}
      bind:value={numberOfPeople}
    />

    <label for="departure-time">როდის გადიხართ?</label>
    <input id="departure-time" type="datetime-local" bind:value={departureTime} />

    <input type="submit" on:click={publish} value="გამოქვეყნება" />
  </form>
{/if}
