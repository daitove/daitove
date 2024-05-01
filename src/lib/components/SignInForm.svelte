<script lang="ts">
  import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updateProfile,
    type ConfirmationResult
  } from '@firebase/auth';

  import { auth } from '$lib/firebase';

  export let showSignInForm: boolean;

  let fullName: string;
  let phoneNumber: string;
  let verificationCode: string;
  let confirmationResult: ConfirmationResult | undefined = undefined;

  async function sendVerificationCode() {
    if (window.recaptchaVerifier === undefined) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal'
      });
    }
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    window.recaptchaVerifier.clear();
  }

  async function confirmVerificationCode() {
    await confirmationResult!.confirm(verificationCode);
    await updateProfile(auth.currentUser!, { displayName: fullName });
    showSignInForm = false;
  }
</script>

{#if showSignInForm}
  {#if confirmationResult === undefined}
    <form>
      <input id="full-name" type="text" placeholder="სახელი და გვარი" bind:value={fullName} />
      <input
        id="phone-number"
        type="text"
        placeholder="ტელეფონის ნომერი"
        bind:value={phoneNumber}
      />
      <button id="send-verification-code" on:click={sendVerificationCode}>გაგრძელება</button>
      <div id="recaptcha-container"></div>
    </form>
  {:else}
    <form>
      <input
        id="verification-code"
        type="text"
        placeholder="ვერიფიკაციის კოდი"
        bind:value={verificationCode}
      />
      <button id="confirm-verification-code" on:click={confirmVerificationCode}>დასრულება</button>
    </form>
  {/if}
{/if}
