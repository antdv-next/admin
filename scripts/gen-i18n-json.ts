import process from 'node:process'
import { generateLocaleJsonFiles } from '../plugins/i18n/json.ts'
import { resolveI18nPluginOptions } from '../plugins/i18n/options.ts'
import { scanLocaleSources } from '../plugins/i18n/scan.ts'

async function main() {
  const root = process.cwd()
  const options = resolveI18nPluginOptions({
    json: {
      outDir: 'public/locales',
      fileName: locale => `${locale}.json`,
    },
  })

  const sources = scanLocaleSources(root, options)
  const outputs = await generateLocaleJsonFiles(root, sources, options)

  outputs.forEach(output => {
    console.log(`[gen:i18n-json] Wrote ${output.filePath}`)
  })
}

main().catch(error => {
  console.error('[gen:i18n-json] Failed to generate locale json files.')
  console.error(error)
  process.exitCode = 1
})
