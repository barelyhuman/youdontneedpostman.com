import { useLocation } from 'wouter'

export function Nav() {
  const [location] = useLocation()
  return (
    <header class="site-nav">
      <div class="site-nav-inner">
        <a href="#/" class="nav-brand">youdontneedpostman.com</a>
        <nav class="">
          <div>
            <a href="#/" class={`nav-link${location === '/' ? ' active' : ''}`} aria-current={location === '/' ? 'page' : undefined}>Alternatives</a>
          </div>
          <div>
            <a href="#/migrate" class={`nav-link${location === '/migrate' ? ' active' : ''}`} aria-current={location === '/migrate' ? 'page' : undefined}>Migrate</a>
          </div>
          <a href="https://usebruno.com" class="btn-primary nav-cta" target="_blank" rel="noopener noreferrer">
            Get Bruno →
          </a>
        </nav>
      </div>
    </header>
  )
}
