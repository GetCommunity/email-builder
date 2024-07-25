import { EmailVariation, UTM_REGEX } from './constants.js';
import { FileDataResult, loadFileByName, saveFileByName } from './email/index.js';
import { getVariationFilename } from './files.js';
import { generateUtmLinkVariation } from './links.js';

export type TestVariation = {
  variation: EmailVariation;
  data: FileDataResult;
};

export function generateEmailHtmlLinkVariations(
  client: string,
  filename: string,
  variations: EmailVariation[]
): TestVariation[] {
  const testHtml = loadFileByName(client, filename, true);
  if (testHtml.error) throw new Error(testHtml.message);
  let htmlVariations: TestVariation[] = [];
  for (let i = 0; i < variations.length; i++) {
    let variation = variations[i];
    const variationName = getVariationFilename(filename, variation.key);
    const variationUtmLink = generateUtmLinkVariation(
      variation.campaign,
      variation.medium,
      variation.source
    );
    const variationHtml = testHtml.content.replace(UTM_REGEX, variationUtmLink);
    const data: FileDataResult = saveFileByName(
      client,
      variationName,
      variationHtml,
      true
    );
    htmlVariations.push({ data, variation });
  }
  return htmlVariations;
}

export function loadEmailHtmlLinkVariations(
  client: string,
  filename: string,
  variations: EmailVariation[]
): TestVariation[] {
  let htmlVariations: TestVariation[] = [];
  for (let i = 0; i < variations.length; i++) {
    let variation = variations[i];
    const variationName = getVariationFilename(filename, variation.key);
    const data = loadFileByName(client, variationName, true);
    htmlVariations.push({ data, variation });
  }
  return htmlVariations;
}
