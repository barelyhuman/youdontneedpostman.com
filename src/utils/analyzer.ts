import type { Format } from './converter'

export interface MigrationReport {
  summary: { totalRequests: number; totalFolders: number }
  scripts: { preRequestCount: number; testCount: number }
  variables: { collectionVars: string[]; runtimeVars: Array<{ name: string; count: number }> }
  auth: { types: string[] }
  bodies: { graphqlCount: number; formDataCount: number; rawJsonCount: number }
  examples: { count: number }
  environment: { converted: boolean; varCount: number }
  warnings: Array<{ type: string; message: string; affectedItems?: string[] }>
  errors: Array<{ type: string; message: string; item?: string }>
}

const RUNTIME_VAR_PATTERN = /\{\{\$([a-zA-Z0-9_]+)\}\}/g

function extractRuntimeVars(text: string): string[] {
  const matches: string[] = []
  let m: RegExpExecArray | null
  while ((m = RUNTIME_VAR_PATTERN.exec(text)) !== null) {
    matches.push('$' + m[1])
  }
  RUNTIME_VAR_PATTERN.lastIndex = 0
  return matches
}

function stringifyValue(val: unknown): string {
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val !== null) return JSON.stringify(val)
  return String(val ?? '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function walkPostmanItems(items: any[]): {
  requests: number
  folders: number
  preRequestCount: number
  testCount: number
  authTypes: Set<string>
  graphqlCount: number
  formDataCount: number
  rawJsonCount: number
  examplesCount: number
  runtimeVarMap: Map<string, number>
  requestNames: string[]
} {
  let requests = 0
  let folders = 0
  let preRequestCount = 0
  let testCount = 0
  const authTypes = new Set<string>()
  let graphqlCount = 0
  let formDataCount = 0
  let rawJsonCount = 0
  let examplesCount = 0
  const runtimeVarMap = new Map<string, number>()
  const requestNames: string[] = []

  function trackRuntimeVars(text: string) {
    for (const v of extractRuntimeVars(text)) {
      runtimeVarMap.set(v, (runtimeVarMap.get(v) ?? 0) + 1)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function walk(items: any[]) {
    for (const item of items) {
      if (Array.isArray(item.item)) {
        folders++
        walk(item.item)
      } else if (item.request) {
        requests++
        requestNames.push(item.name ?? 'unnamed')

        // Scripts
        if (Array.isArray(item.event)) {
          for (const ev of item.event) {
            if (ev.listen === 'prerequest') preRequestCount++
            if (ev.listen === 'test') testCount++
          }
        }

        // Auth
        const auth = item.request?.auth
        if (auth?.type) authTypes.add(auth.type)

        // Body
        const body = item.request?.body
        if (body) {
          if (body.mode === 'graphql') graphqlCount++
          if (body.mode === 'formdata') formDataCount++
          if (body.mode === 'raw') {
            const options = body.options?.raw?.language
            if (options === 'json' || !options) rawJsonCount++
          }
        }

        // Runtime vars in URL
        const url = item.request?.url
        const urlStr =
          typeof url === 'string' ? url : url?.raw ?? ''
        trackRuntimeVars(urlStr)

        // Runtime vars in body
        if (body?.raw) trackRuntimeVars(stringifyValue(body.raw))
        if (body?.formdata) {
          for (const fd of body.formdata) {
            trackRuntimeVars(stringifyValue(fd.value ?? ''))
          }
        }

        // Examples (responses)
        if (Array.isArray(item.response)) {
          examplesCount += item.response.length
        }
      }
    }
  }

  walk(items)
  return {
    requests,
    folders,
    preRequestCount,
    testCount,
    authTypes,
    graphqlCount,
    formDataCount,
    rawJsonCount,
    examplesCount,
    runtimeVarMap,
    requestNames,
  }
}

export function analyzePostman(rawInput: unknown, rawEnvInput: unknown | null): MigrationReport {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const col = rawInput as any
  const items = col?.item ?? []

  const {
    requests,
    folders,
    preRequestCount,
    testCount,
    authTypes,
    graphqlCount,
    formDataCount,
    rawJsonCount,
    examplesCount,
    runtimeVarMap,
  } = walkPostmanItems(items)

  // Collection vars
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectionVars: string[] = (col?.variable ?? []).map((v: any) => v.key ?? v.id ?? '').filter(Boolean)

  // Auth at collection level
  if (col?.auth?.type) authTypes.add(col.auth.type)

  const runtimeVars = Array.from(runtimeVarMap.entries()).map(([name, count]) => ({ name, count }))

  const warnings: MigrationReport['warnings'] = []
  const errors: MigrationReport['errors'] = []

  if (preRequestCount > 0 || testCount > 0) {
    warnings.push({
      type: 'scripts',
      message: `${preRequestCount + testCount} script(s) were translated but may need manual adjustment. Bruno uses JavaScript but the Postman sandbox APIs differ.`,
    })
  }

  if (runtimeVars.length > 0) {
    warnings.push({
      type: 'runtime_vars',
      message: `Dynamic variables (e.g. $randomEmail) are Postman-specific and are not imported into Bruno.`,
      affectedItems: runtimeVars.map((v) => `${v.name} (${v.count}×)`),
    })
  }

  if (examplesCount > 0) {
    warnings.push({
      type: 'examples',
      message: `${examplesCount} saved response example(s) are not currently imported by Bruno.`,
    })
  }

  // Environment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const envVarCount = rawEnvInput ? ((rawEnvInput as any)?.values?.length ?? 0) : 0

  return {
    summary: { totalRequests: requests, totalFolders: folders },
    scripts: { preRequestCount, testCount },
    variables: { collectionVars, runtimeVars },
    auth: { types: Array.from(authTypes) },
    bodies: { graphqlCount, formDataCount, rawJsonCount },
    examples: { count: examplesCount },
    environment: { converted: rawEnvInput !== null, varCount: envVarCount },
    warnings,
    errors,
  }
}

export function analyzeGeneric(rawInput: unknown): MigrationReport {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const col = rawInput as any
  // Best-effort for Insomnia / OpenAPI
  let requests = 0
  let folders = 0

  if (col?.resources) {
    for (const r of col.resources) {
      if (r._type === 'request') requests++
      if (r._type === 'request_group') folders++
    }
  } else if (col?.paths) {
    for (const path of Object.values(col.paths ?? {})) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requests += Object.keys(path as any).filter((k) =>
        ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(k)
      ).length
    }
  }

  return {
    summary: { totalRequests: requests, totalFolders: folders },
    scripts: { preRequestCount: 0, testCount: 0 },
    variables: { collectionVars: [], runtimeVars: [] },
    auth: { types: [] },
    bodies: { graphqlCount: 0, formDataCount: 0, rawJsonCount: 0 },
    examples: { count: 0 },
    environment: { converted: false, varCount: 0 },
    warnings: [],
    errors: [],
  }
}

export function analyze(
  format: Format,
  rawInput: unknown,
  rawEnvInput: unknown | null
): MigrationReport {
  if (format === 'postman') return analyzePostman(rawInput, rawEnvInput)
  return analyzeGeneric(rawInput)
}
