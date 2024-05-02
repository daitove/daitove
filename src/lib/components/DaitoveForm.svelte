<script lang="ts">
  import { onAuthStateChanged, type User } from 'firebase/auth';
  import { addDoc, collection, Timestamp } from 'firebase/firestore/lite';

  import { auth, firestore } from '$lib/firebase';
  import { filterFactory, filterNumericInput } from '$lib/filters';
  import SignInForm from '$lib/components/SignInForm.svelte';

  export let showDaitoveForm: boolean;

  let numberOfPeople = '';
  let fromDate = '';
  let tillDate = '';
  let district = '';
  // let address = '';
  let foodIncluded = false;

  let user: User | null = null;

  onAuthStateChanged(auth, (usr) => (user = usr));

  async function publish() {
    console.log(typeof foodIncluded);
    console.log(foodIncluded);
    addDoc(collection(firestore, 'daitove'), {
      authorUid: user!.uid,
      authorName: user!.displayName?.split(' ')[0],
      phoneNumber: user!.phoneNumber,
      numberOfPeople: parseInt(numberOfPeople),
      fromDate: Timestamp.fromDate(new Date(fromDate)),
      tillDate: Timestamp.fromDate(new Date(tillDate)),
      district: district.trim(),
      // address: address.trim(),
      foodIncluded: foodIncluded
    });

    showDaitoveForm = false;
    numberOfPeople = '';
    fromDate = '';
    tillDate = '';
    district = '';
    // address = '';
    foodIncluded = false;
  }
</script>

{#if user === null}
  <SignInForm showSignInForm={showDaitoveForm} />
{:else if showDaitoveForm}
  <form>
    <label for="number-of-people">რამდენ ადამიანს დაიტოვებთ?</label>
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

    <label for="from-date">რომელი რიცხვიდან?</label>
    <input id="from-date" type="datetime-local" bind:value={fromDate} />

    <label for="till-date">რომელ რიცხვამდე?</label>
    <input id="till-date" type="datetime-local" bind:value={tillDate} />

    <label for="district">რომელ უბანში?</label>
    <input
      id="district"
      type="text"
      list="districts"
      on:input={filterFactory([/[^ა-ჰ]/g, ''])}
      bind:value={district}
    />
    <datalist id="districts">
      <option>გლდანი</option>
      <option>დიდუბე</option>
      <option>ვაკე</option>
      <option>ისანი</option>
      <option>კრწანისი</option>
      <option>მთაწმინდა</option>
      <option>ნაძალადევი</option>
      <option>საბურთალო</option>
      <option>სამგორი</option>
      <option>ჩუღურეთი</option>
    </datalist>

    <!-- <label for="address">რა მისამართზე?</label>
      <input
      id="address"
      type="text"
      placeholder="რუსთაველის გამზირი 8"
      minlength="3"
      maxlength="32"
      on:input={filterTextInput}
      bind:value={address}
      /> -->

    <label for="food-included">შევძლებ კვების უზრუნველყოფას</label>
    <input id="food-included" type="checkbox" bind:checked={foodIncluded} />

    <input type="submit" on:click={publish} value="გამოქვეყნება" />
  </form>
{/if}
