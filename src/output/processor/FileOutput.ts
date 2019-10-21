import { writeFile } from '~src/utils/fs'
import path from 'path'

import { getProcessLogger } from '~src/utils/logger'

type FileOutputOptions = Pick<ExecutionOptions, 'output' | 'outputDir'>

export const FileOutput: OutputProcessor = async (
  previous: Promise<Readonly<{ representation: string; mapping: string }>>,
  options: FileOutputOptions
): Promise<{ representation: string; mapping: string }> => {
  const { representation, mapping } = await previous
  const {
    representation: outputRepresentation,
    mapping: outputMapping,
  } = getOutputPath(options)

  const logger = getProcessLogger()
  logger.log(`=> writing representation to ${outputRepresentation}`)
  logger.log(`=> writing mapping to ${outputMapping}`)

  const writeRepresentation = writeFile(outputRepresentation, representation)
  const writeMapping = writeFile(outputMapping, mapping)

  return {
    representation: await writeRepresentation,
    mapping: await writeMapping,
  }
}

function getOutputPath({
  output: { representation, mapping },
  outputDir,
}: FileOutputOptions): ExecutionOptions['output'] {
  return {
    representation: path.isAbsolute(representation)
      ? representation
      : path.join(outputDir, representation),
    mapping: path.isAbsolute(mapping) ? mapping : path.join(outputDir, mapping),
  }
}
