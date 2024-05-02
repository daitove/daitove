export function filterFactory(...filters: [RegExp, string][]) {
  return function (this: HTMLInputElement) {
    for (const [re, str] of filters) {
      this.value = this.value.replace(re, str);
    }
  };
}

export const filterPhoneNumberInput = filterFactory([/^[^5]/, ''], [/[^0-9]/g, '']);
export const filterNumericInput = filterFactory([/[^0-9]/g, '']);
export const filterTextInput = filterFactory([/^ /, ''], [/[^ ა-ჰ]/g, ''], [/ +/g, ' ']);
