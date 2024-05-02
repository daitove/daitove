export function formatPhoneNumber(phoneNumber: string): string {
  return phoneNumber
    .replace(/^\+995/, '')
    .match(/.{3}/g)!
    .join('-')
    .replace(/^/, '+995-');
}
