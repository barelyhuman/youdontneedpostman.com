function downloadJson(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadCollection(collection: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const name = (collection as any)?.name ?? 'collection'
  const safe = name.replace(/[^a-zA-Z0-9_-]/g, '_')
  downloadJson(collection, `${safe}.json`)
}

export function downloadEnvironment(env: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const name = (env as any)?.name ?? 'environment'
  const safe = name.replace(/[^a-zA-Z0-9_-]/g, '_')
  downloadJson(env, `${safe}.json`)
}
