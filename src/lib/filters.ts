export function filterTextInput(this: HTMLInputElement) {
  this.value = this.value.replace(/[^ ა-ჰ]/g, '');
  this.value = this.value.replace(/^ /, '');
  this.value = this.value.replace(/ +/g, ' ');
}

export function filterNumericInput(this: HTMLInputElement) {
  this.value = this.value.replace(/[^0-9]/g, '');
}

export function filterPhoneNumberInput(this: HTMLInputElement) {
  this.value = this.value.replace(/^[^5]/, '');
  this.value = this.value.replace(/[^0-9]/g, '');
}
