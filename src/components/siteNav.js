import * as React from "react"
import { Link } from "gatsby"
import { useLocation } from "@reach/router"
import { MoonIcon, SunIcon } from "@sanity/icons"

const NAV_FIT_EPSILON = 1
const SIDE_NAV_ENTER_BUFFER_PX = 8
const SIDE_NAV_EXIT_BUFFER_PX = 8
// Always expanded in the side nav; a click-to-open dropdown in the top bar
const RESEARCH_SUBPAGES = [
  { to: "/job-market-paper/", label: "Job Market Paper" },
  { to: "/turnout-paper/", label: "Turnout Paper" },
]

const SiteNav = () => {
  const location = useLocation()
  const navRef = React.useRef(null)
  const researchItemRef = React.useRef(null)
  const brandMeasureRef = React.useRef(null)
  const themeMeasureRef = React.useRef(null)
  const cvMeasureRef = React.useRef(null)
  const researchMeasureRef = React.useRef(null)
  const [isHorizontal, setIsHorizontal] = React.useState(true)
  const [useSideNav, setUseSideNav] = React.useState(false)
  const [isPortrait, setIsPortrait] = React.useState(
    typeof window === "undefined" ? false : window.innerHeight > window.innerWidth,
  )
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [researchOpen, setResearchOpen] = React.useState(false)
  const [isAtTop, setIsAtTop] = React.useState(true)
  const [themeOverride, setThemeOverride] = React.useState(() => {
    if (typeof window === "undefined") {
      return null
    }
    const stored = window.localStorage.getItem("theme-override")
    return stored === "light" || stored === "dark" ? stored : null
  })
  const [systemPrefersDark, setSystemPrefersDark] = React.useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return false
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })
  const pathname = location?.pathname || ""
  const isResearchSectionActive = [
    { to: "/research/" },
    ...RESEARCH_SUBPAGES,
  ].some(({ to }) => pathname === to || pathname === to.replace(/\/$/, ""))

  const updateNavLayout = React.useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    const isLandscape = window.innerWidth > window.innerHeight
    const nextIsPortrait = !isLandscape
    setIsPortrait(nextIsPortrait)

    const shell = document.querySelector(".site-shell")
    if (!shell) {
      return
    }

    const root = document.documentElement
    const rootStyle = window.getComputedStyle(root)
    const shellStyle = window.getComputedStyle(shell)
    // Use the full text width, independent of the current navigation mode.
    // Both outer margins and the shell's horizontal padding are available.
    const contentWidth =
      Number.parseFloat(shellStyle.maxWidth) -
      Number.parseFloat(shellStyle.paddingLeft) -
      Number.parseFloat(shellStyle.paddingRight)
    const remainingWidth = root.clientWidth - contentWidth
    const sideNavBaseThreshold =
      Number.parseFloat(rootStyle.getPropertyValue("--side-nav-width")) +
      Number.parseFloat(rootStyle.getPropertyValue("--side-nav-gap"))
    const sideNavEnterThreshold = sideNavBaseThreshold + SIDE_NAV_ENTER_BUFFER_PX
    const sideNavExitThreshold = sideNavBaseThreshold - SIDE_NAV_EXIT_BUFFER_PX
    const canUseSideNav =
      isLandscape &&
      (useSideNav
        ? remainingWidth >= sideNavExitThreshold
        : remainingWidth >= sideNavEnterThreshold)
    setUseSideNav(canUseSideNav)

    if (canUseSideNav) {
      setIsHorizontal(true)
      setMenuOpen(false)
      return
    }

    if (nextIsPortrait) {
      setIsHorizontal(false)
      return
    }

    const getWidth = ref => ref.current?.getBoundingClientRect().width ?? 0

    const navWidth = navRef.current?.getBoundingClientRect().width ?? 0
    const requiredWidth = getWidth(brandMeasureRef) + getWidth(themeMeasureRef)
    const pageButtonsWidth =
      getWidth(cvMeasureRef) + getWidth(researchMeasureRef)

    if (navWidth <= 0 || requiredWidth <= 0 || pageButtonsWidth <= 0) {
      return
    }

    const availableForPageButtons = navWidth - requiredWidth
    const horizontal =
      pageButtonsWidth <= availableForPageButtons - NAV_FIT_EPSILON

    setIsHorizontal(horizontal)
    if (horizontal) {
      setMenuOpen(false)
    }
  }, [useSideNav])

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    const handleResize = () => {
      updateNavLayout()
    }

    updateNavLayout()
    window.addEventListener("resize", handleResize)

    let resizeObserver
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateNavLayout()
      })
      ;[
        navRef.current,
        brandMeasureRef.current,
        themeMeasureRef.current,
        cvMeasureRef.current,
        researchMeasureRef.current,
      ].forEach(node => {
        if (node) {
          resizeObserver.observe(node)
        }
      })
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        updateNavLayout()
      })
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [updateNavLayout, useSideNav])

  React.useEffect(() => {
    if (typeof window === "undefined" || useSideNav) {
      return undefined
    }

    const frame = window.requestAnimationFrame(() => {
      updateNavLayout()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [useSideNav, updateNavLayout])

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setSystemPrefersDark(media.matches)
    update()

    if (media.addEventListener) {
      media.addEventListener("change", update)
      return () => media.removeEventListener("change", update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    if (themeOverride) {
      document.documentElement.dataset.theme = themeOverride
      window.localStorage.setItem("theme-override", themeOverride)
    } else {
      document.documentElement.removeAttribute("data-theme")
      window.localStorage.removeItem("theme-override")
    }

    return undefined
  }, [themeOverride])

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    const handleScroll = () => {
      const atTop = window.scrollY <= 4
      setIsAtTop(atTop)
      if (isPortrait && !atTop) {
        setMenuOpen(false)
        setResearchOpen(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isPortrait])

  React.useEffect(() => {
    setResearchOpen(false)
  }, [isHorizontal, useSideNav, menuOpen])

  React.useEffect(() => {
    if (typeof window === "undefined" || !researchOpen) {
      return undefined
    }

    const handlePointerDown = event => {
      if (
        researchItemRef.current &&
        !researchItemRef.current.contains(event.target)
      ) {
        setResearchOpen(false)
      }
    }

    const handleKeyDown = event => {
      if (event.key === "Escape") {
        setResearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [researchOpen])

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    if (useSideNav) {
      document.documentElement.dataset.navMode = "side"
    } else {
      document.documentElement.removeAttribute("data-nav-mode")
    }

    return () => {
      document.documentElement.removeAttribute("data-nav-mode")
    }
  }, [useSideNav])

  const effectiveDark = themeOverride
    ? themeOverride === "dark"
    : systemPrefersDark
  const handleThemeToggle = event => {
    const nextDark = !event.target.checked
    if (nextDark === systemPrefersDark) {
      setThemeOverride(null)
    } else {
      setThemeOverride(nextDark ? "dark" : "light")
    }
  }
  const themeToggle = (
    <div className="theme-toggle" aria-label="Theme toggle">
      <MoonIcon className="theme-toggle__icon" aria-hidden="true" />
      <label className="theme-toggle__switch">
        <input
          type="checkbox"
          checked={!effectiveDark}
          onChange={handleThemeToggle}
          aria-label="Toggle theme"
        />
        <span className="theme-toggle__track" />
        <span className="theme-toggle__thumb" />
      </label>
      <SunIcon className="theme-toggle__icon" aria-hidden="true" />
    </div>
  )

  const themeToggleMeasure = (
    <div className="theme-toggle theme-toggle--measure" aria-hidden="true">
      <MoonIcon className="theme-toggle__icon" aria-hidden="true" />
      <span className="theme-toggle__switch">
        <span className="theme-toggle__track" />
        <span className="theme-toggle__thumb" />
      </span>
      <SunIcon className="theme-toggle__icon" aria-hidden="true" />
    </div>
  )

  const handleNavItemSelect = () => {
    setMenuOpen(false)
    setResearchOpen(false)
  }

  const researchMenuId = isHorizontal
    ? "site-nav-research-menu-horizontal"
    : "site-nav-research-menu-vertical"

  const navItems = (
    <>
      <li className="nav-item nav-item--page">
        <Link
          to="/cv/"
          activeClassName="site-nav-link--active"
          onClick={handleNavItemSelect}
        >
          CV
        </Link>
      </li>
      <li
        className="nav-item nav-item--page nav-item--dropdown"
        ref={researchItemRef}
      >
        <button
          className={`site-nav-dropdown-toggle${
            isResearchSectionActive ? " site-nav-link--active" : ""
          }`}
          type="button"
          onClick={() => setResearchOpen(open => !open)}
          aria-expanded={researchOpen}
          aria-controls={researchMenuId}
        >
          <span className="site-nav-dropdown-label">Research</span>
        </button>
        {researchOpen ? (
          <ul
            id={researchMenuId}
            className={`site-nav-dropdown${
              isHorizontal
                ? " site-nav-dropdown--horizontal"
                : " site-nav-dropdown--vertical"
            }`}
          >
            {[{ to: "/research/", label: "Overview" }, ...RESEARCH_SUBPAGES].map(
              ({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    activeClassName="site-nav-link--active"
                    onClick={handleNavItemSelect}
                  >
                    {label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        ) : null}
      </li>
    </>
  )

  const navListHorizontal = (
    <ul className="site-nav-list">
      <li className="nav-item nav-item--brand">
        <Link to="/" onClick={handleNavItemSelect}>
          Konrad Dierks
        </Link>
      </li>
      <li className="nav-item nav-item--theme">{themeToggle}</li>
      {navItems}
    </ul>
  )

  const navListVertical = (
    <ul className="site-nav-list site-nav-list--vertical">{navItems}</ul>
  )

  const navListMeasure = (
    <ul className="site-nav-list site-nav-list--measure" aria-hidden="true">
      <li className="nav-item nav-item--brand" ref={brandMeasureRef}>
        <a href="/" tabIndex={-1}>
          Konrad Dierks
        </a>
      </li>
      <li className="nav-item nav-item--theme" ref={themeMeasureRef}>
        {themeToggleMeasure}
      </li>
      <li className="nav-item nav-item--page" ref={cvMeasureRef}>
        <a href="/cv/" tabIndex={-1}>
          CV
        </a>
      </li>
      <li className="nav-item nav-item--page" ref={researchMeasureRef}>
        <span className="site-nav-dropdown-toggle" aria-hidden="true">
          Research
        </span>
      </li>
    </ul>
  )

  const sideNavList = (
    <ul className="site-side-nav-list">
      <li className="site-side-nav-item site-side-nav-item--header">
        <Link to="/" onClick={handleNavItemSelect}>
          Konrad Dierks
        </Link>
        {themeToggle}
      </li>
      <li className="site-side-nav-item">
        <Link
          to="/cv/"
          activeClassName="site-nav-link--active"
          onClick={handleNavItemSelect}
        >
          CV
        </Link>
      </li>
      <li className="site-side-nav-item">
        <Link
          to="/research/"
          activeClassName="site-nav-link--active"
          onClick={handleNavItemSelect}
        >
          Research
        </Link>
        <ul className="site-side-nav-sublist">
          {RESEARCH_SUBPAGES.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                activeClassName="site-nav-link--active"
                partiallyActive={true}
                onClick={handleNavItemSelect}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  )

  if (useSideNav) {
    return (
      <aside className="site-side-nav">
        <nav className="site-side-nav-nav" aria-label="Primary">
          {sideNavList}
        </nav>
      </aside>
    )
  }

  return (
    <div
      className={`site-nav-bar${
        isPortrait && !isAtTop ? " site-nav-bar--hidden" : ""
      } ${isHorizontal ? "site-nav-bar--horizontal" : "site-nav-bar--vertical"}`}
    >
      <div className="site-nav-inner">
        <header className="site-header site-header--bar">
          <nav className="site-nav" aria-label="Primary" ref={navRef}>
            {isHorizontal ? (
              navListHorizontal
            ) : (
              <div className="site-nav-mobile">
                <div className="site-nav-mobile-header">
                  <div className="site-nav-mobile-left">
                    <Link className="site-nav-mobile-brand" to="/">
                      Konrad Dierks
                    </Link>
                    {themeToggle}
                  </div>
                  <button
                    className="site-nav-toggle"
                    type="button"
                    onClick={() => {
                      setMenuOpen(open => !open)
                    }}
                    aria-expanded={menuOpen}
                  >
                    {menuOpen ? "Close" : "Menu"}
                  </button>
                </div>
                {menuOpen ? navListVertical : null}
              </div>
            )}
            {navListMeasure}
          </nav>
        </header>
      </div>
    </div>
  )
}

export default SiteNav
