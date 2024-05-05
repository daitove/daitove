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
    await updateProfile(auth.currentUser!, { displayName: fullName.trim() });
    fullName = '';
    phoneNumber = '';
    verificationCode = '';

    dispatch('signin', {
      uid: auth.currentUser!.uid
    });
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<form
  class="absolute z-50 top-1/4 h-64 w-96 flex rounded-2xl bg-stone-100 bg-opacity-100 text-gray-700"
  on:click={(e) => {
    e.stopPropagation();
  }}
>
  <input
    id="full-name"
    type="text"
    placeholder="სახელი"
    minlength="2"
    maxlength="32"
    on:input={filterTextInput}
    bind:value={fullName}
    class="
        absolute top-4 left-16 h-8 w-64
        bg-inherit
        border-b border-gray-700
        text-lg
        outline-none appearance-none overflow-hidden
        focus:bg-inherit
      "
  />

  <input
    id="phone-number"
    type="text"
    inputmode="numeric"
    placeholder="მობილური"
    minlength="9"
    maxlength="9"
    on:input={filterPhoneNumberInput}
    bind:value={phoneNumber}
    class="
        absolute top-14 left-16 h-8 w-32
        bg-inherit
        border-b border-gray-700
        text-lg
        outline-none appearance-none overflow-hidden
        focus:bg-inherit
      "
  />

  {#if confirmationResult === undefined}
    <button
      on:click={sendVerificationCode}
      class="
          absolute top-[6.5rem] left-16 h-12 w-64
          rounded-lg
          bg-blue-600
          text-lg font-medium text-stone-100
        "
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
      class="
        absolute top-14 left-52 h-8 w-28
        bg-inherit
        border-b border-gray-700
        text-lg
        outline-none appearance-none overflow-hidden
        focus:bg-inherit
      "
    />

    <button
      on:click={confirmVerificationCode}
      class="
          absolute top-[6.5rem] left-16 h-12 w-64
          rounded-lg
          bg-blue-600
          text-lg font-medium text-stone-100
        "
    >
      შესვლა
    </button>
  {/if}

  <div id="recaptcha-container" class="absolute z-100 left-10 bottom-5"></div>
</form>

<style lang="postcss">
  input {
    border-radius: 0;
    appearance: none;
    -webkit-appearance: none;
  }
</style>
