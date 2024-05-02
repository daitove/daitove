export function formatPhoneNumber(phoneNumber: string): string {
  return (
    '+995-' +
    phoneNumber
      .replace(/^\+995/, '')
      .match(/.{3}/g)!
      .join('-')
  );
}
