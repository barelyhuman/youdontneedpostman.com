import * as yaml from 'js-yaml'
import {
  postmanToBruno,
  postmanToBrunoEnvironment,
  insomniaToBruno,
  openApiToBruno,
} from '@usebruno/converters'

export type Format = 'postman' | 'insomnia' | 'openapi'

export interface ConversionResult {
  collection: unknown
  env: unknown | null
  rawInput: unknown
  rawEnvInput: unknown | null
}

function parseFile(text: string, filename: string): unknown {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) {
    return yaml.load(text)
  }
  return JSON.parse(text)
}

async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
    reader.readAsText(file)
  })
}

export async function convert(
  format: Format,
  collectionFile: File,
  envFile: File | null
): Promise<ConversionResult> {
  const collectionText = await readFile(collectionFile)
  const rawInput = parseFile(collectionText, collectionFile.name)

  let collection: unknown
  let env: unknown | null = null
  let rawEnvInput: unknown | null = null

  if (format === 'postman') {
    collection = await postmanToBruno(rawInput, { useWorkers: false })
    if (envFile) {
      const envText = await readFile(envFile)
      rawEnvInput = parseFile(envText, envFile.name)
      env = postmanToBrunoEnvironment(rawEnvInput)
    }
  } else if (format === 'insomnia') {
    collection = await insomniaToBruno(rawInput)
  } else if (format === 'openapi') {
    collection = await openApiToBruno(rawInput)
  } else {
    throw new Error(`Unknown format: ${format}`)
  }

  return { collection, env, rawInput, rawEnvInput }
}
