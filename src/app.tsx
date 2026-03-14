import { useState } from 'preact/hooks'
import './app.css'
import { FileUpload } from './components/FileUpload'
import { MigrationReportView } from './components/MigrationReport'
import { convert } from './utils/converter'
import type { Format } from './utils/converter'
import { analyze } from './utils/analyzer'
import type { MigrationReport } from './utils/analyzer'

type Step = 'upload' | 'report'

export function App() {
  const [step, setStep] = useState<Step>('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collection, setCollection] = useState<unknown>(null)
  const [env, setEnv] = useState<unknown | null>(null)
  const [report, setReport] = useState<MigrationReport | null>(null)

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
        <div class="app-header-inner">
          <h1 class="app-title">Bruno Migration Tool</h1>
          <p class="app-subtitle">Preview your migration before installing Bruno</p>
        </div>
      </header>

      <nav class="wizard-steps" aria-label="Progress">
        <div class={`wizard-step${step === 'upload' ? ' active' : step === 'report' ? ' done' : ''}`}>
          <span class="step-num">1</span>
          <span class="step-label">Upload</span>
        </div>
        <div class="step-connector" />
        <div class={`wizard-step${step === 'report' ? ' active' : ''}`}>
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
