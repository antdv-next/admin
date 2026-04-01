import { resolve } from 'node:path'
import { readConfigFile, sys } from 'typescript'
import { describe, expect, it } from 'vite-plus/test'

function readAppTsconfig() {
  const tsconfigPath = resolve(process.cwd(), 'tsconfig.app.json')
  const { config, error } = readConfigFile(tsconfigPath, sys.readFile)

  expect(error).toBeUndefined()

  return config as {
    compilerOptions?: {
      rootDir?: string
    }
  }
}

describe('typed router tsconfig', () => {
  it('defines a rootDir for vue-router typed routes', () => {
    const tsconfig = readAppTsconfig()

    expect(tsconfig.compilerOptions?.rootDir).toBe('.')
  })
})
