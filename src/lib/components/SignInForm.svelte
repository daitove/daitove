<script lang="ts">
  import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updateProfile,
    type ConfirmationResult
  } from '@firebase/auth';

  import { auth } from '$lib/firebase';
  import { filterNumericInput, filterPhoneNumberInput, filterTextInput } from '$lib/filters';

  export let showSignInForm: boolean;

  let fullName: string = '';
  let phoneNumber: string = '';
  let verificationCode: string = '';
  let recaptchaVerifier: RecaptchaVerifier | undefined = undefined;
  let confirmationResult: ConfirmationResult | undefined = undefined;

  async function sendVerificationCode() {
    console.log('sending...');
    if (recaptchaVerifier === undefined) {
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal'
      });
    }
    await recaptchaVerifier.verify();
    confirmationResult = await signInWithPhoneNumber(auth, '+995' + phoneNumber, recaptchaVerifier);
    recaptchaVerifier.clear();
  }

  async function confirmVerificationCode() {
    await confirmationResult!.confirm(verificationCode);
    await updateProfile(auth.currentUser!, { displayName: fullName.trim() });
    showSignInForm = false;
    fullName = '';
    phoneNumber = '';
    verificationCode = '';
  }
</script>

{#if showSignInForm}
  {#if confirmationResult === undefined}
    <form>
      <label for="full-name">სახელი</label>
      <input
        id="full-name"
        type="text"
        placeholder="ერმალო მაღრაძე"
        minlength="2"
        maxlength="32"
        on:input={filterTextInput}
        bind:value={fullName}
      />

      <label for="phone-number">ტელეფონის ნომერი</label>
      <input
        id="phone-number"
        type="text"
        inputmode="numeric"
        placeholder="599102030"
        minlength="9"
        maxlength="9"
        on:input={filterPhoneNumberInput}
        bind:value={phoneNumber}
      />

      <input type="submit" on:click={sendVerificationCode} value="გაგრძელება" />

      <div id="recaptcha-container"></div>
    </form>
  {:else}
    <form>
      <label for="verification-code">SMS კოდი</label>
      <input
        id="verification-code"
        type="text"
        inputmode="numeric"
        placeholder="123456"
        minlength="6"
        maxlength="6"
        on:input={filterNumericInput}
        bind:value={verificationCode}
      />

      <input type="sumbit" on:click={confirmVerificationCode} value="დასრულება" />
    </form>
  {/if}
{/if}
