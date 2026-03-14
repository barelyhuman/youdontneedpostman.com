import { useState, useRef } from 'preact/hooks'
import type { JSX } from 'preact'
import { IconCheck, IconUpload } from '@tabler/icons-preact'
import type { Format } from '../utils/converter'

interface Props {
  onFilesSelected: (format: Format, collectionFile: File, envFile: File | null) => void
  loading: boolean
}

const FORMATS: { value: Format; label: string; description: string }[] = [
  { value: 'postman', label: 'Postman', description: 'Collection JSON' },
  { value: 'insomnia', label: 'Insomnia', description: 'Export JSON' },
  { value: 'openapi', label: 'OpenAPI', description: 'Spec JSON or YAML' },
]

function DropZone({
  label,
  accept,
  file,
  onFile,
}: {
  label: string
  accept: string
  file: File | null
  onFile: (f: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) onFile(f)
  }

  const handleChange = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    const f = (e.target as HTMLInputElement).files?.[0]
    if (f) onFile(f)
  }

  return (
    <div
      class={`upload-zone${dragging ? ' dragging' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      {file ? (
        <div class="upload-zone-file">
          <IconCheck class="upload-zone-icon" size={20} />
          <span class="upload-zone-name">{file.name}</span>
          <span class="upload-zone-size">({(file.size / 1024).toFixed(1)} KB)</span>
        </div>
      ) : (
        <div class="upload-zone-placeholder">
          <IconUpload class="upload-zone-icon" size={24} />
          <span>{label}</span>
          <span class="upload-zone-hint">Drop file here or click to browse</span>
        </div>
      )}
    </div>
  )
}

export function FileUpload({ onFilesSelected, loading }: Props) {
  const [format, setFormat] = useState<Format>('postman')
  const [collectionFile, setCollectionFile] = useState<File | null>(null)
  const [envFile, setEnvFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = () => {
    if (!collectionFile) {
      setError('Please select a collection file.')
      return
    }
    setError(null)
    onFilesSelected(format, collectionFile, envFile)
  }

  const handleFormatChange = (f: Format) => {
    setFormat(f)
    setCollectionFile(null)
    setEnvFile(null)
    setError(null)
  }

  return (
    <div class="upload-panel">
      <h2>Select format</h2>
      <div class="format-tabs" role="radiogroup">
        {FORMATS.map((f) => (
          <label key={f.value} class={`format-tab${format === f.value ? ' active' : ''}`}>
            <input
              type="radio"
              name="format"
              value={f.value}
              checked={format === f.value}
              onChange={() => handleFormatChange(f.value)}
              style={{ display: 'none' }}
            />
            <strong>{f.label}</strong>
            <span class="format-tab-desc">{f.description}</span>
          </label>
        ))}
      </div>

      <h2>Upload collection</h2>
      <DropZone
        label="Collection file (.json, .yaml, .yml)"
        accept=".json,.yaml,.yml"
        file={collectionFile}
        onFile={setCollectionFile}
      />

      {format === 'postman' && (
        <>
          <h2>Upload environment <span class="optional">(optional)</span></h2>
          <DropZone
            label="Environment file (.json)"
            accept=".json"
            file={envFile}
            onFile={setEnvFile}
          />
        </>
      )}

      {error && <p class="error-text">{error}</p>}

      <button
        class="btn-primary"
        onClick={handleAnalyze}
        disabled={loading || !collectionFile}
      >
        {loading && <span class="spinner" />}
        {loading ? 'Analyzing…' : 'Analyze Migration'}
      </button>
    </div>
  )
}
