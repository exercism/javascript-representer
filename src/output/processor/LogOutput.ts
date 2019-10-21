import { getProcessLogger } from '~src/utils/logger'

export const LogOutput: OutputProcessor = async (previous) => {
  const output = await previous

  const logger = getProcessLogger()
  logger.log(`=> representation: \n\n${output.representation}\n`)
  logger.log(`=> mapping: \n\n${output.mapping}\n`)
  return output
}
