import fs from 'fs';
import path from 'path';
import { MjmlBuildResult, compileMjmlHtml } from './email/email-html-compiler.js';
import { loadFileByName, saveFileByName } from './email/email-html-loader.js';

/**
 * @description Load files from a directory
 */
export function loadFiles(dir: string, endsWith: string, fileList: string[]): string[] {
  // read the contents of the directory
  const files = fs.readdirSync(dir);
  // search through the files
  for (const file of files) {
    // build the full path of the file
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    // get the file stats
    // if the file is a directory, recursively search the directory
    if (fileStat.isDirectory()) {
      loadFiles(filePath, endsWith, fileList);
    } else if (fileStat.isFile()) {
      if (file.endsWith(endsWith)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

/**
 * @description Load files from a directory
 */
export function loadDirs(dir: string, dirList: string[]): string[] {
  // read the contents of the directory
  const files = fs.readdirSync(dir);
  // search through the files
  for (const file of files) {
    // build the full path of the file
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    // get the file stats
    // if the file is a directory
    if (fileStat.isDirectory()) {
      dirList.push(filePath);
    }
  }
  return dirList;
}

export type FilePathParts = {
  client: string;
  filename: string;
  ext: string;
};

/**
 * @description Parse the client and filename from a file path
 */
export function parseClientFromFilePath(filePath: string) {
  const fileParts = filePath.split('/');
  const client = fileParts[fileParts.length - 2];
  const filename = fileParts[fileParts.length - 1];
  const fileEnd = filename.split('.');
  const ext = fileEnd[fileEnd.length - 1];
  return { client, filename, ext };
}

export type MjmlToHtmlResult = {
  error: boolean;
  message: string;
  client: string;
  mjmlFile: string;
  htmlFile: string;
};

/**
 * @description Process an mjml file to html
 */
export function processMjmlFile(file: string): MjmlToHtmlResult {
  let result = {
    error: true,
    message: '',
    client: '',
    mjmlFile: file,
    htmlFile: '',
  };
  // parse the client and filename from the file path
  const client = parseClientFromFilePath(file);
  result.client = client.client;
  // load the file data
  const fileData = loadFileByName(client.client, client.filename, false);
  let mjmlData: MjmlBuildResult | undefined = undefined;
  // if the file was loaded successfully
  // compile the mjml file to html
  if (!fileData.error) {
    mjmlData = compileMjmlHtml(fileData.content);
  } else {
    result.error = fileData.error;
    result.message = fileData.message;
  }
  // if the mjml file was compiled successfully
  // save the html file
  if (mjmlData && !mjmlData.error) {
    const htmlFilename = client.filename.replace('.mjml', '.html');
    const htmlFile = saveFileByName(client.client, htmlFilename, mjmlData.html, true);
    result.error = htmlFile.error;
    result.message = htmlFile.message;
    result.htmlFile = htmlFile.path;
  } else if (mjmlData) {
    result.error = mjmlData.error;
    result.message = mjmlData.message;
  }
  return result;
}

/**
 * @description Generate a filename for tracking link variations
 */
export function getVariationFilename(
  baseFilename: string,
  variationKey: string
): string {
  let variationName = baseFilename.split('.').slice(0, -1);
  variationName.push(variationKey);
  return variationName.join('_') + '.html';
}
