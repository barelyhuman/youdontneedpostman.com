import { Router, Route } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { Nav } from './components/Nav'
import { AlternativesPage } from './pages/AlternativesPage'
import { MigratePage } from './pages/MigratePage'
import './app.css'

export function App() {
  return (
    <Router hook={useHashLocation}>
      <div id="page-root">
        <Nav />
        <Route path="/" component={AlternativesPage} />
        <Route path="/migrate" component={MigratePage} />
      </div>
    </Router>
  )
}
