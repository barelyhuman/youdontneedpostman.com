import { Router, Route } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { Nav } from './components/Nav'
import { AlternativesPage } from './pages/AlternativesPage'
import { MigratePage } from './pages/MigratePage'
import './app.css'
import { AboutPage } from './pages/AboutPage'

export function App() {
  return (
    <Router hook={useHashLocation}>
      <div id="page-root">
        <Nav />
        <Route path="/" component={AlternativesPage} />
        <Route path="/migrate" component={MigratePage} />
        <Route path="/about" component={AboutPage} />
        <footer class="site-footer">
          <p>
            <strong>Satire disclaimer:</strong> This site's name is a satire and commentary on the state of API tooling.
            It is not affiliated with, endorsed by, or connected to Postman, Inc. in any way.
            "Postman" is a registered trademark of Postman, Inc.
            All conversion runs entirely in your browser — no data is sent to any server.
          </p>
        </footer>
      </div>
    </Router>
  )
}
