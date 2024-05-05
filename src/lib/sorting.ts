import leventstein from 'js-levenshtein';

export function bestMatchFactory(target: string) {
  return function (a: string, b: string): number {
    if (a.startsWith(target)) return -1;
    if (b.startsWith(target)) return 1;
    return leventstein(a, target) - leventstein(b, target);
  };
}
