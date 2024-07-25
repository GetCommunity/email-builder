import { ROOT_HTML, ROOT_MJML } from './constants.js';
import { MjmlToHtmlResult, loadFiles, processMjmlFile } from './index.js';

/**
 * @description render new mjml files to html files:
 * finds the difference between the MJML and HTML arrays
 * and only renders files that have not been processed.
 *
 * @returns {MjmlToHtmlResult[]} list of rendered file results
 */
export function renderNewMjmlToHtml(): MjmlToHtmlResult[] {
  let mjmlFiles = loadFiles(ROOT_MJML, 'mjml', []);
  let htmlFiles = loadFiles(ROOT_HTML, 'html', []);
  mjmlFiles = mjmlFiles.filter((mjmlFile) => {
    let htmlFile = mjmlFile.replace('mjml', 'html');
    htmlFile = htmlFile.replace('.mjml', '.html');
    return !htmlFiles.includes(htmlFile);
  });
  let renderedFiles = mjmlFiles.map(processMjmlFile);
  return renderedFiles;
}

/**
 * @description render all mjml files to html files
 * regardless of whether they have been processed or not.
 *
 * @returns {MjmlToHtmlResult[]} list of rendered file results
 */
export function renderAllMjmlToHtml(): MjmlToHtmlResult[] {
  let mjmlFiles = loadFiles(ROOT_MJML, 'mjml', []);
  let renderedFiles = mjmlFiles.map(processMjmlFile);
  return renderedFiles;
}
