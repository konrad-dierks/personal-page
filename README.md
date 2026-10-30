Source code for my personal page, [https://www.konraddierks.eu/](https://www.konraddierks.eu/), built with [Astro](https://astro.build).

The site includes my CV, an overview of my research, a page for my job market paper, and a page with bonus content (interactive plots) for

Konrad Dierks, Ingela Alger, and Jean-François Laslier, Does universalization ethics justify participation in large elections?, TSE Working Paper. [https://www.tse-fr.eu/publications/working-paper/does-universalization-ethics-justify-participation-large-elections-0](https://www.tse-fr.eu/publications/working-paper/does-universalization-ethics-justify-participation-large-elections-0)

## Development

- `yarn install`, then `yarn dev` for a local preview (requires Node 22.23.4 or newer)
- `yarn format` to format the code with Prettier

The site is deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml` on every push to the `source` branch. The portrait photo, the job market paper and the CV are not tracked in git: the workflow downloads them into `static/` from the `assets` release.

## Credits and licenses

The code is licensed under the MIT license. The photo, paper and CV are not; see [NOTICE.md](NOTICE.md), which also lists the third party packages.

- The turnout paper icon "[Arcticons-black emoji ballot box with ballot](https://commons.wikimedia.org/w/index.php?curid=157180000)" by Arcticons Team is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Modified (line width; colors inverted for the dark theme).
- The job market paper icon "[building-wind-turbine](https://tabler.io/icons?icon=building-wind-turbine)" from Tabler Icons by Paweł Kuna is licensed under the [MIT License](https://github.com/tabler/tabler-icons/blob/main/LICENSE). Modified (line width; colors inverted for the dark theme).
