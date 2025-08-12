import * as cheerio from 'cheerio';

export function generateTOCAndContent(html: string) {
  const $ = cheerio.load(html);
  const headings = $('h2, h3, h4');
  const tocItems = [];
  const idPrefix = 'section';

  let h2Count = 0;
  let h3Count = 0;
  let h4Count = 0;

  headings.each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = $(el).text().trim();

    if (tag === 'h2') {
      h2Count++;
      h3Count = 0;
      h4Count = 0;
    } else if (tag === 'h3') {
      if (h2Count === 0) return;
      h3Count++;
      h4Count = 0;
    } else if (tag === 'h4') {
      if (h2Count === 0 || h3Count === 0) return;
      h4Count++;
    }

    // IDだけは階層ごとにユニークにする
    const idParts = [h2Count];
    if (tag === 'h3' || tag === 'h4') idParts.push(h3Count);
    if (tag === 'h4') idParts.push(h4Count);
    const id = `${idPrefix}-${idParts.join('-')}`;

    // 表示番号は単独のカウントにする
    let number = '1';
    if (tag === 'h2') number = String(h2Count);
    if (tag === 'h3') number = String(h3Count);
    if (tag === 'h4') number = String(h4Count);

    $(el).attr('id', id);

    tocItems.push({
      id,
      text,
      level: parseInt(tag.replace('h', '')),
      number,
    });
  });

  function buildTOCHTML(items) {
    const toc: string[] = [];
    let levelStack: number[] = [];

    toc.push('<ul class="toc_list">');

    items.forEach((item) => {
      const currentLevel = item.level;

      if (levelStack.length === 0) {
        levelStack.push(currentLevel);
      } else if (currentLevel > levelStack[levelStack.length - 1]) {
        toc.push('<ul>');
        levelStack.push(currentLevel);
      } else if (currentLevel < levelStack[levelStack.length - 1]) {
        while (levelStack.length && currentLevel < levelStack[levelStack.length - 1]) {
          toc.push('</li></ul>');
          levelStack.pop();
        }
        toc.push('</li>');
      } else {
        toc.push('</li>');
      }

      toc.push(
        `<li><a href="#${item.id}"><span class="toc_number toc_depth_${item.level}">${item.number}</span> ${item.text}</a>`
      );
    });

    while (levelStack.length > 0) {
      toc.push('</li></ul>');
      levelStack.pop();
    }

    return toc.join('');
  }

  const tocHtml = buildTOCHTML(tocItems);
  const updatedHtml = $('body').html() || '';

  return { tocHtml, updatedHtml };
}