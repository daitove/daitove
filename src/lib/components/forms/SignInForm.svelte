<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updateProfile,
    type ConfirmationResult
  } from '@firebase/auth';

  import { auth } from '$lib/firebase';
  import { filterNumericInput, filterPhoneNumberInput, filterTextInput } from '$lib/filters';

  let fullName: string = '';
  let phoneNumber: string = '';
  let verificationCode: string = '';
  let recaptchaVerifier: RecaptchaVerifier | undefined = undefined;
  let confirmationResult: ConfirmationResult | undefined = undefined;
  let showDisplayNameForm = false;

  const dispatch = createEventDispatcher();

  async function sendVerificationCode() {
    if (recaptchaVerifier === undefined) {
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal'
      });
      await recaptchaVerifier.verify();
    }
    confirmationResult = await signInWithPhoneNumber(auth, '+995' + phoneNumber, recaptchaVerifier);
    recaptchaVerifier.clear();
  }

  async function confirmVerificationCode() {
    await confirmationResult!.confirm(verificationCode);

    showDisplayNameForm = !auth.currentUser?.displayName;

    phoneNumber = '';
    verificationCode = '';

    if (!showDisplayNameForm) {
      dispatch('signin', {
        uid: auth.currentUser!.uid
      });
    }
  }

  async function setDisplayName() {
    await updateProfile(auth.currentUser!, { displayName: fullName.trim() });
    fullName = '';

    dispatch('signin', {
      uid: auth.currentUser!.uid
    });
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<form
  class="absolute z-50 flex h-64 text-gray-700 bg-opacity-100 top-1/4 w-96 rounded-2xl bg-stone-100"
  on:click={(e) => {
    e.stopPropagation();
  }}
>
  {#if showDisplayNameForm}
    <input
      id="full-name"
      type="text"
      placeholder="სახელი"
      minlength="2"
      maxlength="32"
      on:input={filterTextInput}
      bind:value={fullName}
      class="absolute w-64 h-8 overflow-hidden text-lg border-b border-gray-700 outline-none appearance-none top-14 left-16 bg-inherit focus:bg-inherit"
    />

    <button
      on:click={setDisplayName}
      class="absolute top-[6.5rem] left-16 h-12 w-64 rounded-lg bg-blue-600 text-lg font-medium text-stone-100 fx-click-sm"
    >
      შენახვა
    </button>
  {:else}
    <input
      id="phone-number"
      type="text"
      inputmode="numeric"
      placeholder="მობილური"
      minlength="9"
      maxlength="9"
      on:input={filterPhoneNumberInput}
      bind:value={phoneNumber}
      class="absolute w-32 h-8 overflow-hidden text-lg border-b border-gray-700 outline-none appearance-none top-14 left-16 bg-inherit focus:bg-inherit"
    />

    {#if confirmationResult === undefined}
      <button
        on:click={sendVerificationCode}
        class="absolute top-[6.5rem] left-16 h-12 w-64 rounded-lg bg-blue-600 text-lg font-medium text-stone-100 fx-click-sm"
      >
        კოდის გაგზავნა
      </button>
    {:else}
      <input
        type="text"
        inputmode="numeric"
        placeholder="SMS კოდი"
        minlength="6"
        maxlength="6"
        on:input={filterNumericInput}
        bind:value={verificationCode}
        class="absolute h-8 overflow-hidden text-lg border-b border-gray-700 outline-none appearance-none top-14 left-52 w-28 bg-inherit focus:bg-inherit"
      />

      <button
        on:click={confirmVerificationCode}
        class="absolute top-[6.5rem] left-16 h-12 w-64 rounded-lg bg-blue-600 text-lg font-medium text-stone-100 fx-click-sm"
      >
        შესვლა
      </button>
    {/if}

    <div id="recaptcha-container" class="absolute z-100 left-10 bottom-5"></div>
  {/if}
</form>

<style lang="postcss">
  input {
    border-radius: 0;
    appearance: none;
    -webkit-appearance: none;
  }
</style>
