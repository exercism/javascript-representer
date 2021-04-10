import { getProcessLogger } from '@exercism/static-analysis'
import type { OutputProcessor } from '../../interface'

export const LogOutput: OutputProcessor = async (previous) => {
  const output = await previous

  const logger = getProcessLogger()
  logger.log(`=> representation: \n\n${output.representation}\n`)
  logger.log(`=> mapping: \n\n${output.mapping}\n`)
  return output
}
