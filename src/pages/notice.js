import React from "react"
import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"

const NoticePage = () => {
  const tableStyle = {
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    width: "100%",
  }
  const cellStyle = {
    paddingRight: "16px",
    verticalAlign: "top",
  }
  const headerStyle = { ...cellStyle, textAlign: "left" }
  const mainPackages = [
    {
      name: "gatsby",
      license: "MIT",
      link: "https://github.com/gatsbyjs/gatsby.git",
      author: "Kyle Mathews",
    },
    {
      name: "react",
      license: "MIT",
      link: "https://github.com/facebook/react.git",
      author: "Meta Platforms, Inc",
    },
    {
      name: "react-dom",
      license: "MIT",
      link: "https://github.com/facebook/react.git",
      author: "Meta Platforms, Inc",
    },
    {
      name: "@fontsource-variable/source-sans-3",
      license: "OFL-1.1",
      link: "https://github.com/fontsource/fontsource.git",
      author: "Fontsource",
    },
    {
      name: "@fontsource/libertinus-serif",
      license: "OFL-1.1",
      link: "https://github.com/fontsource/font-files.git",
      author: "Fontsource",
    },
    {
      name: "@sanity/icons",
      license: "MIT",
      link: "https://github.com/sanity-io/icons",
      author: "Sanity.io",
    },
    {
      name: "gh-pages",
      license: "MIT",
      link: "https://github.com/tschaub/gh-pages.git",
      author: "Tim Schaub",
    },
    {
      name: "prettier",
      license: "MIT",
      link: "https://github.com/prettier/prettier.git",
      author: "James Long",
    },
  ]

  const plotPackages = [
    {
      name: "flo-poly",
      license: "MIT",
      link: "https://github.com/FlorisSteenkamp/FloPoly.git",
      author: "Floris Steenkamp",
    },
    {
      name: "plotly.js",
      license: "MIT",
      link: "https://github.com/plotly/plotly.js.git",
      author: "Plotly, Inc.",
    },
    {
      name: "react-plotly.js",
      license: "MIT",
      link: "https://github.com/plotly/react-plotly.js.git",
      author: "Plotly, Inc.",
    },
    {
      name: "react-latex-next",
      license: "MIT",
      link: "https://github.com/harunurhan/react-latex-next.git",
      author: "harunurhan",
    },
    {
      name: "react-tabs",
      license: "MIT",
      link: "https://github.com/reactjs/react-tabs.git",
      author: "Matt Zabriskie",
    },
    {
      name: "@loadable/component",
      license: "MIT",
      link: "https://github.com/gregberge/loadable-components.git",
      author: "Greg Bergé",
    },
  ]

  return (
    <SiteLayout>
      <div>
        <h2>Main site packages</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Name</th>
              <th style={headerStyle}>License type</th>
              <th style={headerStyle}>Link</th>
              <th style={headerStyle}>Author</th>
            </tr>
          </thead>
          <tbody>
            {mainPackages.map(pkg => (
              <tr key={pkg.name}>
                <td style={cellStyle}>{pkg.name}</td>
                <td style={cellStyle}>{pkg.license}</td>
                <td style={cellStyle}>
                  <a href={pkg.link} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td style={cellStyle}>{pkg.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Additional packages used for plots</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Name</th>
              <th style={headerStyle}>License type</th>
              <th style={headerStyle}>Link</th>
              <th style={headerStyle}>Author</th>
            </tr>
          </thead>
          <tbody>
            {plotPackages.map(pkg => (
              <tr key={pkg.name}>
                <td style={cellStyle}>{pkg.name}</td>
                <td style={cellStyle}>{pkg.license}</td>
                <td style={cellStyle}>
                  <a href={pkg.link} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td style={cellStyle}>{pkg.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SiteLayout>
  )
}

export const Head = () => <Seo title="Third party package notice" />

export default NoticePage
