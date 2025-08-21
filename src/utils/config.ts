export const BASE_URL = (process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL || "").replace(/\/+$/, "") + "/";

export const PER_PAGE = 2;