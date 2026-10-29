const fs = require("node:fs")
const path = require("node:path")

const extractBodyHtml = html => {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return bodyMatch ? bodyMatch[1].trim() : html
}

exports.onCreatePage = async ({ page, actions }) => {
  if (page.path !== "/cv/") {
    return
  }

  const { deletePage, createPage } = actions
  let cvHtml = ""

  try {
    const cvHtmlPath = path.join(
      process.cwd(),
      "static",
      "cv_konrad_dierks.html"
    )
    const rawHtml = fs.readFileSync(cvHtmlPath, "utf8")
    cvHtml = extractBodyHtml(rawHtml)
  } catch (error) {
    console.warn("[cv] Could not load static/cv_konrad_dierks.html", error)
  }

  deletePage(page)
  createPage({
    ...page,
    context: {
      ...page.context,
      cvHtml,
    },
  })
}
