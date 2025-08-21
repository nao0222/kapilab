import { BASE_URL} from '@/utils/config';

//記事一覧の取得
export async function getPosts() {
  const res = BASE_URL;
  const posts = await res.json();
  return posts;
}

//カテゴリーの取得
export async function getCategories() {
  if (!BASE_URL) throw new Error("PUBLIC_API_URL が設定されていませんよー");

  const url = new URL("categories", BASE_URL);
  url.searchParams.set("per_page", "50");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`カテゴリ取得に失敗しました！: ${res.status}`);

  return await res.json();
}

//ピックアップの取得
// export async function getPickup() {
//   const res = await fetch(`${BASE_URL}pickup?acf_format=standard`);
//   const pickup = await res.json();
//   const relatedIds = pickup[0]?.acf?.related_posts ?? [];
//   return pickup;
// }


// 固定ページ一覧を取得
export async function getPages() {
  const res = await fetch(`${BASE_URL}pages`);
  const pages = await res.json();
  return pages;
}

// 固定ページ詳細をスラッグやIDで取得
export async function getPageBySlug(slug: string) {
  const res = await fetch(`${BASE_URL}pages?slug=${slug}&_embed`);
  const pages = await res.json();
  return pages.length > 0 ? pages[0] : null;
}