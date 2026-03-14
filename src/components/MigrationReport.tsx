import type { MigrationReport } from '../utils/analyzer'
import { downloadCollection, downloadEnvironment } from '../utils/download'
import { IconCheck, IconAlertTriangle, IconX, IconMinus } from '@tabler/icons-preact'

interface Props {
  report: MigrationReport
  collection: unknown
  env: unknown | null
  onStartOver: () => void
}

function SummaryCard({ label, value, status }: { label: string; value: number | string; status?: 'ok' | 'warn' | 'error' }) {
  const cls = status === 'warn' ? 'badge warning' : status === 'error' ? 'badge error' : 'badge success'
  return (
    <div class="summary-card">
      <span class={cls}>{value}</span>
      <span class="summary-label">{label}</span>
    </div>
  )
}

function Section({ title, status, children }: { title: string; status: 'ok' | 'warn' | 'error' | 'neutral'; children: preact.ComponentChildren }) {
  const Icon = status === 'ok' ? IconCheck : status === 'warn' ? IconAlertTriangle : status === 'error' ? IconX : IconMinus
  const cls = status === 'ok' ? 'section-status ok' : status === 'warn' ? 'section-status warn' : status === 'error' ? 'section-status error' : 'section-status neutral'
  return (
    <div class="report-section">
      <div class="section-header">
        <span class={cls}><Icon size={16} /></span>
        <h3>{title}</h3>
      </div>
      <div class="section-body">{children}</div>
    </div>
  )
}

export function MigrationReportView({ report, collection, env, onStartOver }: Props) {
  const { summary, scripts, variables, auth, bodies, examples, environment, warnings, errors } = report

  const scriptCount = scripts.preRequestCount + scripts.testCount
  const scriptStatus = scriptCount > 0 ? 'warn' : 'ok'
  const varStatus = variables.runtimeVars.length > 0 ? 'warn' : 'ok'
  const authStatus = auth.types.length > 0 ? 'ok' : 'neutral'

  return (
    <div class="report-panel">
      <h2>Migration Analysis</h2>

      <div class="report-grid">
        <SummaryCard label="Requests" value={summary.totalRequests} status="ok" />
        <SummaryCard label="Folders" value={summary.totalFolders} status="ok" />
        <SummaryCard label="Scripts" value={scriptCount} status={scriptCount > 0 ? 'warn' : 'ok'} />
        <SummaryCard label="Warnings" value={warnings.length} status={warnings.length > 0 ? 'warn' : 'ok'} />
        {errors.length > 0 && <SummaryCard label="Errors" value={errors.length} status="error" />}
      </div>

      <div class="report-sections">
        <Section title="Scripts" status={scriptStatus}>
          <p>Pre-request: <strong>{scripts.preRequestCount}</strong> &nbsp;|&nbsp; Test: <strong>{scripts.testCount}</strong></p>
          {scriptCount > 0 && (
            <p class="hint">Translated but may need manual adjustment — Bruno's JavaScript sandbox differs from Postman's.</p>
          )}
        </Section>

        <Section title="Variables" status={varStatus}>
          {variables.collectionVars.length > 0 ? (
            <p>Collection vars ({variables.collectionVars.length}): <code>{variables.collectionVars.slice(0, 8).join(', ')}{variables.collectionVars.length > 8 ? ` +${variables.collectionVars.length - 8} more` : ''}</code></p>
          ) : (
            <p>No collection variables</p>
          )}
          {variables.runtimeVars.length > 0 && (
            <p class="warn-text">
              Runtime vars not imported: {variables.runtimeVars.map((v) => `${v.name} (${v.count}×)`).join(', ')}
            </p>
          )}
        </Section>

        <Section title="Auth" status={authStatus}>
          {auth.types.length > 0 ? (
            <p>Types detected: <code>{auth.types.join(', ')}</code></p>
          ) : (
            <p>No auth detected</p>
          )}
        </Section>

        <Section title="Request Bodies" status="neutral">
          <p>
            Raw JSON: <strong>{bodies.rawJsonCount}</strong> &nbsp;|&nbsp;
            Form data: <strong>{bodies.formDataCount}</strong> &nbsp;|&nbsp;
            GraphQL: <strong>{bodies.graphqlCount}</strong>
          </p>
        </Section>

        {examples.count > 0 && (
          <Section title="Examples" status="warn">
            <p class="warn-text">{examples.count} saved response example(s) are not currently imported by Bruno.</p>
          </Section>
        )}

        <Section title="Environment" status={environment.converted ? 'ok' : 'neutral'}>
          {environment.converted ? (
            <p>Converted — <strong>{environment.varCount}</strong> variable(s)</p>
          ) : (
            <p>No environment file uploaded</p>
          )}
        </Section>

        {warnings.length > 0 && (
          <Section title="Warnings" status="warn">
            <ul class="issue-list">
              {warnings.map((w, i) => (
                <li key={i} class="issue-item warn">
                  <p>{w.message}</p>
                  {w.affectedItems && w.affectedItems.length > 0 && (
                    <p class="issue-items">{w.affectedItems.join(', ')}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {errors.length > 0 && (
          <Section title="Errors" status="error">
            <ul class="issue-list">
              {errors.map((e, i) => (
                <li key={i} class="issue-item error">
                  <p>{e.message}</p>
                  {e.item && <p class="issue-items">{e.item}</p>}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div class="report-actions">
        <button class="btn-primary" onClick={() => downloadCollection(collection)}>
          Download Collection
        </button>
        {env && (
          <button class="btn-secondary" onClick={() => downloadEnvironment(env)}>
            Download Environment
          </button>
        )}
        <button class="btn-secondary" onClick={onStartOver}>
          Start Over
        </button>
      </div>
    </div>
  )
}
