import * as cheerio from 'cheerio';
import { formatDateToDotAndWeekday } from '@/utils/date';

export async function replaceRelatedBlockWithContent(html: string) {
  const $ = cheerio.load(html);

  const blocks = $('.related-post-block');

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const postId = $(block).attr('data-post-id');
    const customTitle = $(block).attr('data-title');

    if (postId) {
      try {
        const res = await fetch(`${import.meta.env.PUBLIC_API_URL}posts/${postId}?_embed`);
        const post = await res.json();

        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
        const title = post.title?.rendered || '';
        const link = `/${post.id}`;
        const date = formatDateToDotAndWeekday(post.date);

        const html = `
          <div>
            <p class="text-center relative z-1">
              <span class="inline-block bg-black text-white text-xs font-bold py-[6px] px-7">${customTitle}</span>
            </p>
            <a href="${link}/" class="block -mt-4 group text-black no-underline">
              <div class="border border-black bg-white rounded-[5px] px-6 pt-8 pb-6 lg:p-6 lg:flex lg:items-center">
                <div class="overflow-hidden rounded-2xl lg:w-[33%]"><img src="${featuredImage}" alt="${title}" class="w-full transition duration-500 group-hover:scale-105"></div>
                <div class="lg:w-[46%] lg:ml-[4%]">
                  <p class="text-xs text-[#888] font-bold mt-2 lg:mt-0 transition duration-500 group-hover:text-[#FE2F8C]">${date}</p>
                  <p class="font-bold text-lg mt-2 leading-relaxed transition duration-500 group-hover:text-[#FE2F8C]">${title}</p>
                </div>
                <div class="lg:w-[7%] lg:ml-[6%] hidden lg:block">
                  <svg class="w-full w-max-[50px]" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="25" fill="black"/>
                    <path d="M16 24C15.4477 24 15 24.4477 15 25C15 25.5523 15.4477 26 16 26V24ZM35.7071 25.7071C36.0976 25.3166 36.0976 24.6834 35.7071 24.2929L29.3431 17.9289C28.9526 17.5384 28.3195 17.5384 27.9289 17.9289C27.5384 18.3195 27.5384 18.9526 27.9289 19.3431L33.5858 25L27.9289 30.6569C27.5384 31.0474 27.5384 31.6805 27.9289 32.0711C28.3195 32.4616 28.9526 32.4616 29.3431 32.0711L35.7071 25.7071ZM16 25V26L35 26V25V24L16 24V25Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </a>
          </div>
        `;

        $(block).replaceWith(html);
      } catch (err) {
        console.error(`Error fetching related post with ID ${postId}`, err);
      }
    }
  }


  return $.html();
}
