import { useState } from 'preact/hooks'
import { useLocation } from 'wouter'
import { IconMenu2, IconX } from '@tabler/icons-preact'

export function Nav() {
  const [location] = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header class="site-nav">
      {menuOpen && <div class="nav-backdrop" onClick={closeMenu} aria-hidden="true" />}
      <div class="site-nav-inner">
        <a href="#/" class="nav-brand" onClick={closeMenu}>youdontneedpostman.com</a>
        <button
          class="nav-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
        </button>
        <nav class={`nav-menu${menuOpen ? ' open' : ''}`}>
          <div>
            <a href="#/" class={`nav-link${location === '/' ? ' active' : ''}`} aria-current={location === '/' ? 'page' : undefined} onClick={closeMenu}>Alternatives</a>
          </div>
          <div>
            <a href="#/migrate" class={`nav-link${location === '/migrate' ? ' active' : ''}`} aria-current={location === '/migrate' ? 'page' : undefined} onClick={closeMenu}>Migrate</a>
          </div>
          <div>
            <a href="#/about" class={`nav-link${location === '/about' ? ' active' : ''}`} aria-current={location === '/about' ? 'page' : undefined} onClick={closeMenu}>About</a>
          </div>
          <div>
            <a href="https://github.com/barelyhuman/youdontneedpostman.com" class="nav-link" target="_blank" rel="noopener noreferrer" aria-label="Source on GitHub" onClick={closeMenu}>GitHub</a>
          </div>
          <a href="https://usebruno.com" class="btn-primary nav-cta" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            Get Bruno →
          </a>
        </nav>
      </div>
    </header>
  )
}
