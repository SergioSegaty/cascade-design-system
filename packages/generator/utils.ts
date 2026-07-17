export function capitalizeWord(word?: string) {
  if (!word) return 'Unamed';
  return word.at(0)?.toUpperCase() + word.slice(1);
}
