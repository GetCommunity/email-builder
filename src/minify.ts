import htmlMinify from 'html-minifier';
import { FileDataResult, loadFileByName, saveFileByName } from './email';
import { TestVariation } from './variations';

export const minifyOptions: htmlMinify.Options = {
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  processConditionalComments: true,
};

export function minifyEmailHtml(
  client: string,
  email: string,
  variation: TestVariation
) {
  const rawHtml = loadFileByName(client, email, true);
  const joinedHtml = rawHtml.content;
  let savedHtml: FileDataResult;
  const variationOut: TestVariation = variation;
  try {
    const minifiedHtml: string = htmlMinify.minify(joinedHtml, minifyOptions);
    savedHtml = saveFileByName(client, email, minifiedHtml, true);
    variationOut.data = savedHtml;
    console.log(`${variation.data.filename} → Minified`);
  } catch (error) {
    console.error(`Error minifying ${variation.data.filename}`, error);
  }
  return variationOut;
}
