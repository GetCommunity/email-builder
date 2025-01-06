import mjml2html from 'mjml';

export type MjmlBuildResult = {
  error: boolean;
  message: string;
  html: string;
};

/**
 * @description render the mjml file to html
 */
export function compileMjmlHtml(fileContent: string): MjmlBuildResult {
  const htmlBuild = {
    error: true,
    message: '',
    html: '',
  };
  let htmlOutput = undefined;
  htmlOutput = mjml2html(fileContent);
  if (htmlOutput && htmlOutput.errors.length > 0) {
    htmlBuild.error = true;
    htmlBuild.message = '';
    htmlOutput.errors.forEach((error) => {
      htmlBuild.message += `Error: ${error.message} at line ${error.line} \n`;
    });
  } else {
    htmlBuild.error = false;
    htmlBuild.message = 'MJML file compiled successfully';
    htmlBuild.html = htmlOutput.html;
  }
  return htmlBuild;
}
