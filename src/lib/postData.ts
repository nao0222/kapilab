import { getCategories } from "@/lib/wp";
import { BASE_URL, PER_PAGE } from '@/utils/config';

//投稿をページごとに取得（ページネーション）
export async function getPaginatedPosts(page: number = 1, perPage: number = PER_PAGE) {
  const res = await fetch(`${BASE_URL}posts?_embed&page=${page}&per_page=${perPage}`);
  const posts = await res.json();

  const total = parseInt(res.headers.get("X-WP-Total") || "0", 10);         // 投稿の総数
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "0", 10); // 総ページ数

  return { posts, total, totalPages };
}

// 投稿取得・カテゴリ取得・マッピング処理をまとめた共通関数
export async function getPostListWithCategories(page: number, perPage: number) {
  const [categoryList, { posts, totalPages }] = await Promise.all([
    getCategories(),
    getPaginatedPosts(page, PER_PAGE),
  ]);
  const categoryMap = new Map(categoryList.map((cat) => [cat.id, cat.name]));
  return {
    posts,
    totalPages,
    categoryMap,
  };
}

// ピックアップ投稿タイプの取得
export async function getPickupPosts() {
  // ピックアップ取得
  const res = await fetch(`${BASE_URL}pickup?acf_format=standard`);
  const pickupList = await res.json();

  if (!Array.isArray(pickupList) || pickupList.length === 0) return [];

  // 関連投稿IDを全pickupから取得
  const allRelatedIds = pickupList
    .flatMap(pickup => pickup.acf?.acf_pickup?.map(p => p.ID) ?? [])
    .filter((id, i, arr) => arr.indexOf(id) === i);

  if (allRelatedIds.length === 0) return [];

  const params = `include=${allRelatedIds.join(",")}`;

  const postRes = await fetch(`${BASE_URL}posts?_embed&${params}`);
  const posts = await postRes.json();

  // エラー対策：postsが配列か確認
  if (!Array.isArray(posts)) {
    console.error("posts is not an array!", posts);
    return [];
  }

  // 取得したID順に並べ替え
  const sorted = allRelatedIds.map(id => posts.find(p => p.id === id)).filter(Boolean);
  return sorted;
}


//詳細ページ取得
export async function fetchPostIds() {
  const res = await fetch(`${BASE_URL}posts`);
  const posts = await res.json();

  return posts.map((post) => ({
    params: { id: post.id.toString() },
  }));
}


// カテゴリー別に投稿をページネーション付きで取得する関数
export async function getPaginatedPostsByCategory(categorySlug: string, page: number = 1, perPage: number = PER_PAGE) {
  const categories = await getCategories();

  const targetCategory = categories.find(cat => cat.slug === categorySlug);
  if (!targetCategory) throw new Error(`Category '${categorySlug}' not found`);

  let categoryIds: number[] = [targetCategory.id];

  // 親カテゴリなら子カテゴリのIDも取得
  if (!targetCategory.parent) {
    const childIds = categories
      .filter(cat => cat.parent === targetCategory.id)
      .map(cat => cat.id);

    categoryIds = [targetCategory.id, ...childIds];
  }

  const query = `categories=${categoryIds.join(',')}&_embed&page=${page}&per_page=${perPage}`;
  const res = await fetch(`${BASE_URL}posts?${query}`);
  const posts = await res.json();

  const total = parseInt(res.headers.get("X-WP-Total") || "0", 10);
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "0", 10);

  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

  return {
    posts,
    totalPages,
    categoryMap,
  };
}


//関連する記事の取得
export async function getRelatedPosts(currentPostId: number, categorySlug: string, limit: number = 3) {
  const categories = await getCategories();

  // 対象カテゴリーをIDで特定
  const targetCategory = categories.find(cat => cat.slug === categorySlug);
  if (!targetCategory) throw new Error(`Category '${categorySlug}' not found`);

  // クエリで対象カテゴリの投稿を取得。_embed付きで最新順、自己投稿除外
  const query = `categories=${targetCategory.id}&_embed&per_page=${limit + 1}&orderby=date&order=desc`;
  const res = await fetch(`${BASE_URL}posts?${query}`);
  const posts = await res.json();

  // 自分の記事を除外し、limit件まで絞る
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, limit);

  return relatedPosts;
}