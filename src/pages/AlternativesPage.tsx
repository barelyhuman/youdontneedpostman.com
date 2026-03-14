import { useEffect } from 'preact/hooks'
import { IconCurrencyDollar, IconLock, IconHome } from '@tabler/icons-preact'
import { ToolCard } from '../components/ToolCard'

const faqItems = [
  {
    question: 'Is Bruno really free?',
    answer:
      "Bruno's core is open-source and free to use. Paid plans exist to sustain development and unlock non-critical features, but you can use Bruno fully for free for most workflows.",
  },
  {
    question: 'How do I migrate from Postman to Bruno?',
    answer:
      'Use the migration tool above — upload your Postman collection, preview what transfers, and download the Bruno format. The whole process runs in your browser. You can also download bruno from https://usebruno.com and run the migration in the app',
  },
  {
    question: 'Will my Postman pre-request scripts work in Bruno?',
    answer:
      'Bruno supports JavaScript scripts; most scripts transfer cleanly during the migration process. Some APIs might need minor adjustment since Bruno uses a slightly different scripting API.',
  },
  {
    question: 'Can I collaborate on Bruno collections with my team?',
    answer:
      'Yes — collections are plain files on disk. Commit them to git and collaborate like any other code. No shared cloud account needed.',
  },
  {
    question: 'Is Yaak free?',
    answer: 'Yaak has a free tier. Paid plans for commercial licenses.',
  },
  {
    question: 'Is my data safe when converting?',
    answer:
      'All conversion runs entirely in your browser — nothing is sent to any server. Your collections never leave your machine.',
  },
]

export function AlternativesPage() {
  useEffect(() => {
    document.title = "You Don't Need Postman — Bruno & Yaak Alternatives"

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Discover Bruno and Yaak — free, open-source Postman alternatives. Migrate your Postman collections in minutes. No cloud lock-in, git-native, offline-first.',
      )
    }
  }, [])

  useEffect(() => {
    const existing = document.getElementById('ld-json')
    if (existing) return

    const schemas = [
      {
        id: 'ld-json',
        data: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Best Postman Alternatives',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Bruno',
              url: 'https://usebruno.com',
              description: 'Open-source, git-native API client that stores collections as files',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Yaak',
              url: 'https://yaak.app',
              description: 'Modern, cross-platform API client with a clean UI',
            },
          ],
        },
      },
      {
        id: 'ld-json-faq',
        data: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      },
      {
        id: 'ld-json-howto',
        data: {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to migrate Postman collections to Bruno',
          description:
            'Convert your Postman API collections to Bruno format using the free browser-based migration tool.',
          step: [
            {
              '@type': 'HowToStep',
              position: 1,
              name: 'Upload your collection',
              text: 'Select your Postman collection JSON file (and optionally an environment file) in the migration tool.',
            },
            {
              '@type': 'HowToStep',
              position: 2,
              name: 'Review the migration report',
              text: 'Check the analysis — see which requests, scripts, auth types, and variables will transfer.',
            },
            {
              '@type': 'HowToStep',
              position: 3,
              name: 'Download Bruno format',
              text: 'Download the converted collection files and open them in Bruno.',
            },
          ],
        },
      },
    ]

    for (const { id, data } of schemas) {
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    }

    return () => {
      for (const { id } of schemas) {
        const el = document.getElementById(id)
        if (el) el.remove()
      }
    }
  }, [])

  return (
    <main class="alt-page">
      <section class="hero">
        <h1>You Don't Need Postman</h1>
        <p class="hero-sub">
          Better API clients exist — free, open-source Postman alternatives that are offline-first and actually good.
        </p>
        <a href="#/migrate" class="btn-primary hero-cta">
          Migrate your Postman collections →
        </a>
      </section>

      <section class="why-switch">
        <h2 class="section-title">Why switch?</h2>
        <div class="why-cards">
          <div class="why-card">
            <div class="why-icon">
              <IconCurrencyDollar size={28} />
            </div>
            <h3>Pricing shock</h3>
            <p>Postman's free tier is increasingly limited. Teams face steep bills just to collaborate on APIs.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">
              <IconLock size={28} />
            </div>
            <h3>Cloud lock-in</h3>
            <p>Your API collections live on Postman's servers. Lose your subscription — lose access to your work.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">
              <IconHome size={28} />
            </div>
            <h3>Community First</h3>
            <p>You should be able to both contribute and help direct the direction of the product</p>
          </div>
        </div>
      </section>

      <section class="tools-section">
        <h2 class="section-title">The alternatives</h2>
        <div class="tools-grid">
          <ToolCard
            name="Bruno"
            tagline="Open-source · Git-native · Offline-first"
            description="Your API collections live on disk as plain files. Version them with git, use them offline, pay nothing. Bruno is the obvious upgrade from Postman."
            badges={['Open source', 'Git-native', 'Offline', 'Free forever', '40k+ ★ GitHub']}
            ctaLabel="Get Bruno →"
            ctaHref="https://usebruno.com"
            accentColor="#f4a623"
            logo="https://raw.githubusercontent.com/usebruno/mintlify-docs/main/logo/light.png"
            featured
          />
          <ToolCard
            name="Yaak"
            tagline="Modern UI · Cross-platform · Fast"
            description="Yaak is a modern API client focused on simplicity and speed. Clean interface, great UX, and works on all platforms."
            badges={['Modern UI', 'Cross-platform', 'Fast', 'Local storage', '18k+ ★ GitHub']}
            ctaLabel="Try Yaak →"
            ctaHref="https://yaak.app"
            accentColor="#7c3aed"
            logo="/logos/yaak.svg"
          />
        </div>
      </section>

      <section class="comparison-section">
        <h2 class="section-title">Bruno & Yaak vs Postman at a glance</h2>
        <p class="section-note">
          <small>Note: This is a rough comparision of things that matter, a more details comparision can be found at each app's own website</small>
        </p>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Bruno</th>
                <th>Yaak</th>
                <th>Postman</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                <td>Free (open-source)</td>
                <td>Free tier; paid for team features</td>
                <td>Free tier; paid from $19/user/mo</td>
              </tr>
              <tr>
                <td>Cloud storage</td>
                <td>None required — files on disk</td>
                <td>Local storage; Allows syncing with local directory</td>
                <td>Required for collaboration</td>
              </tr>
              <tr>
                <td>Git support</td>
                <td>Native — collections are plain files</td>
                <td>Additional configuration required but syncs with Git</td>
                <td>Limited / manual export</td>
              </tr>
              <tr>
                <td>Offline</td>
                <td>Fully offline</td>
                <td>Fully offline</td>
                <td>Partial — some features require cloud</td>
              </tr>
              <tr>
                <td>Open source</td>
                <td>Yes (MIT)</td>
                <td>Yes (MIT)</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Scripting</td>
                <td>JavaScript (pre/post request)</td>
                <td>Scripting support</td>
                <td>JavaScript (pm.* API)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="faq-section">
        <h2 class="section-title">Frequently asked questions</h2>
        <dl class="faq-list">
          {faqItems.map((item) => (
            <div class="faq-item" key={item.question}>
              <dt class="faq-question">{item.question}</dt>
              <dd class="faq-answer">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
