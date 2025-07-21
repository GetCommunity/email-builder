import fs from "fs"

export function generateUtmLinkVariation(
  utm: string
  // campaign: string,
  // medium: string,
  // source: string
): string {
  // return `?utm_campaign=${campaign}&utm_medium=${medium}&utm_source=${source}`;
  return utm
}

export function extractLinksFromString(str: string, lower: boolean = false): string[] {
  const regexp =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b([-a-zA-Z0-9()'@:%_+.~#?!&//=]*)/gi
  const bracketsRegexp = /[()]|\.$/g
  if (typeof str !== "string") {
    throw new TypeError(`The str argument should be a string, got ${typeof str}`)
  }
  if (str) {
    const urls = str.match(regexp)
    if (urls) {
      return lower
        ? urls.map((item) => item.toLowerCase().replace(bracketsRegexp, ""))
        : urls.map((item) => item.replace(bracketsRegexp, ""))
    } else {
      return []
    }
  } else {
    return []
  }
}

export function compileTrackingLinksFromFile(htmlFile: string): string[] {
  let links: string[] = []
  try {
    const content = fs.readFileSync(htmlFile, "utf8")
    const csvFileName = htmlFile.replace(".html", ".csv")
    links = extractLinksFromString(content)
    links = links.filter((link: string) => link.includes("utm_campaign"))
    // remove duplicates
    links = [...new Set(links)]
    links.sort()
    links.unshift("UTM Link")
    const csvText = links.join("\n")
    fs.writeFileSync(csvFileName, csvText)
  } catch (error) {
    console.error(error)
  }
  return links
}
