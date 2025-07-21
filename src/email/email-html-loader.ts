import fs from "fs"
import path from "path"
import { ROOT_HTML, ROOT_MJML } from "../constants.js"

export type FileDataResult = {
  error: boolean
  message: string
  path: string
  filename: string
  content: string
}

/**
 * @description Create directories if they do not exist
 */
export function createDirsIfNotExists(filepath: string) {
  const dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * @description Load an HTML file from the build directory
 */
export function loadFileByName(
  client: string,
  filename: string,
  isHtml: boolean = true
): FileDataResult {
  const fileData: FileDataResult = {
    error: true,
    message: "",
    path: "",
    filename: filename,
    content: ""
  }
  try {
    if (!filename) {
      throw new Error("Filename is required")
    }
    if (!client) {
      throw new Error("Client is required")
    }
    let __filepath = ""
    if (isHtml) {
      __filepath = path.join(ROOT_HTML, client, filename)
    } else {
      __filepath = path.join(ROOT_MJML, client, filename)
    }
    const file_content = fs.readFileSync(__filepath, "utf8")
    fileData.path = __filepath
    fileData.error = false
    fileData.content = file_content
    fileData.message = ""
  } catch (error: unknown) {
    fileData.error = true
    fileData.content = ""
    if (error instanceof Error) {
      fileData.message = error.message
    } else {
      fileData.message = "An error occurred."
    }
  }
  return fileData
}

/**
 * @description Save a file by name
 */
export function saveFileByName(
  client: string,
  filename: string,
  content: string,
  isHtml: boolean = true
): FileDataResult {
  const fileData: FileDataResult = {
    error: true,
    message: "",
    path: "",
    filename: filename,
    content: content
  }
  try {
    let __filepath = ""
    if (isHtml) {
      __filepath = path.join(ROOT_HTML, client, filename)
    } else {
      __filepath = path.join(ROOT_MJML, client, filename)
    }
    fileData.path = __filepath
    createDirsIfNotExists(__filepath)
    fs.writeFileSync(__filepath, content)
    fileData.error = false
    fileData.message = ""
  } catch (error: unknown) {
    fileData.error = true
    if (error instanceof Error) {
      fileData.message = error.message
    } else {
      fileData.message = "An error occurred."
    }
  }
  return fileData
}
