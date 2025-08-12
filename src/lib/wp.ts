//記事一覧の取得
export async function getPosts() {
  const res = await fetch(`${import.meta.env.PUBLIC_API_URL}posts?_embed`);
  const posts = await res.json();
  return posts;
}

//カテゴリーの取得
export async function getCategories() {
  const base = import.meta.env.PUBLIC_API_URL.replace(/\/+$/, "") + "/";
  const res = await fetch(`${base}categories?per_page=50`);
  if (!res.ok) throw new Error("カテゴリ取得に失敗しました");
  const categories = await res.json();
  return categories;
}

//ピックアップの取得
// export async function getPickup() {
//   const res = await fetch(`${import.meta.env.PUBLIC_API_URL}pickup?acf_format=standard`);
//   const pickup = await res.json();
//   const relatedIds = pickup[0]?.acf?.related_posts ?? [];
//   return pickup;
// }


// 固定ページ一覧を取得
export async function getPages() {
  const res = await fetch(`${import.meta.env.PUBLIC_API_URL}pages`);
  const pages = await res.json();
  return pages;
}

// 固定ページ詳細をスラッグやIDで取得
export async function getPageBySlug(slug: string) {
  const res = await fetch(`${import.meta.env.PUBLIC_API_URL}pages?slug=${slug}&_embed`);
  const pages = await res.json();
  return pages.length > 0 ? pages[0] : null;
}