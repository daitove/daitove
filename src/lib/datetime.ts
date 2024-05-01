export function getMonth(date: Date, lang: 'ka' | 'en' = 'ka'): string {
  return {
    ka: [
      'იანვარი',
      'თებერვალი',
      'მარტი',
      'აპრილი',
      'მაისი',
      'ივნისი',
      'ივლისი',
      'აგვისტო',
      'სექტემბერი',
      'ოქტომბერი',
      'ნოემბერი',
      'დეკემბერი'
    ],
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  }[lang][date.getMonth()];
}
