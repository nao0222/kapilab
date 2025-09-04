//正規表現でタグ削除
export function stripHtml(html?: string) {
  return (html || '').replace(/<[^>]*>/g, '');
}