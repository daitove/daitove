// export function formatPhoneNumber(phoneNumber: string): string {
//   return phoneNumber
//     .replace(/^\+995/, '')
//     .match(/.{3}/g)!
//     .join('-')
//     .replace(/^/, '+995-');
// }

export function formatPhoneNumber(phoneNumber: string): string {
  return phoneNumber
    .replace(/^\+995/, '')
    .match(/(^.{3}|.{2})/g)!
    .join('-');
}

export const formatTime = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).format;
