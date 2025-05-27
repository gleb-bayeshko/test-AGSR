export function pluralizeWord(
  base: string,
  endings: { one: string; few: string; many: string }
) {
  return (count: number): string => {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;

    let ending: string;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      ending = endings.many;
    } else if (lastDigit === 1) {
      ending = endings.one;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      ending = endings.few;
    } else {
      ending = endings.many;
    }

    return base + ending;
  };
}
