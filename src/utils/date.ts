export function formatDateToDotAndWeekday(dateString: string): string {
  const date = new Date(dateString);

  // 各要素をゼロ埋めして取り出し
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  // 英語の曜日（例：MON, TUE）
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  return `${year}.${month}.${day} ${weekday}`;
}