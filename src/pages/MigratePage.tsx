import { useState, useEffect } from 'preact/hooks'
import { IconAlertTriangle } from '@tabler/icons-preact'
import { FileUpload } from '../components/FileUpload'
import { MigrationReportView } from '../components/MigrationReport'
import { convert } from '../utils/converter'
import type { Format } from '../utils/converter'
import { analyze } from '../utils/analyzer'
import type { MigrationReport } from '../utils/analyzer'

type Step = 'upload' | 'report'

export function MigratePage() {
  const [step, setStep] = useState<Step>('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collection, setCollection] = useState<unknown>(null)
  const [env, setEnv] = useState<unknown | null>(null)
  const [report, setReport] = useState<MigrationReport | null>(null)

  useEffect(() => {
    document.title = 'Migrate from Postman — youdontneedpostman.com'

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Free browser-based tool to migrate Postman, Insomnia, or OpenAPI collections to Bruno format. No upload required — runs entirely in your browser.',
      )
    }

    const script = document.createElement('script')
    script.id = 'ld-json-migrate'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Bruno Migration Tool',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Convert Postman, Insomnia, or OpenAPI collections to Bruno format. Free, browser-based, no data uploaded.',
    })
    document.head.appendChild(script)

    return () => {
      const el = document.getElementById('ld-json-migrate')
      if (el) el.remove()
    }
  }, [])

  const handleFilesSelected = async (format: Format, collectionFile: File, envFile: File | null) => {
    setLoading(true)
    setError(null)
    try {
      const result = await convert(format, collectionFile, envFile)
      const migrationReport = analyze(format, result.rawInput, result.rawEnvInput)
      setCollection(result.collection)
      setEnv(result.env)
      setReport(migrationReport)
      setStep('report')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleStartOver = () => {
    setStep('upload')
    setCollection(null)
    setEnv(null)
    setReport(null)
    setError(null)
  }

  return (
    <div class="app-container">
      <header class="app-header">
        <h1 class="app-title">Bruno Migration Tool</h1>
        <p class="app-subtitle">Preview your migration before installing Bruno</p>
      </header>

      <nav class="wizard-steps" aria-label="Progress">
        <div class={`wizard-step${step === 'upload' ? ' active' : ' done'}`}>
          <span class="step-num">1</span>
          <span class="step-label">Upload</span>
        </div>
        <div class="step-connector" />
        <div class={`wizard-step${step === 'report' ? ' done' : ''}`}>
          <span class="step-num">2</span>
          <span class="step-label">Analysis</span>
        </div>
        <div class="step-connector" />
        <div class={`wizard-step${step === 'report' ? ' active' : ''}`}>
          <span class="step-num">3</span>
          <span class="step-label">Download</span>
        </div>
      </nav>

      <main class="app-main">
        {error && (
          <div class="error-banner" role="alert">
            <IconAlertTriangle size={16} />
            <strong>Error:</strong> {error}
          </div>
        )}

        {step === 'upload' && (
          <FileUpload onFilesSelected={handleFilesSelected} loading={loading} />
        )}

        {step === 'report' && report && (
          <MigrationReportView
            report={report}
            collection={collection}
            env={env}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <footer class="app-footer">
        <p>Runs entirely in your browser — no data is uploaded to any server.</p>
      </footer>
    </div>
  )
}
