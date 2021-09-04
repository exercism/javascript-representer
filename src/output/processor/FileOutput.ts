import { getProcessLogger, writeFile } from '@exercism/static-analysis'
import path from 'path'
import type { ExecutionOptions, OutputProcessor } from '../../interface'

type FileOutputOptions = Pick<ExecutionOptions, 'output' | 'outputDir'>

export const FileOutput: OutputProcessor = async (
  previous: Promise<Readonly<{ representation: string; mapping: string }>>,
  options: FileOutputOptions
): Promise<{ representation: string; mapping: string }> => {
  const { representation, mapping } = await previous
  const { representation: outputRepresentation, mapping: outputMapping } =
    getOutputPath(options)

  const logger = getProcessLogger()
  logger.log(`=> writing representation to ${outputRepresentation}`)
  logger.log(`=> writing mapping to ${outputMapping}`)

  const writeRepresentation = writeFile(
    outputRepresentation,
    representation
  ).then(() => representation)
  const writeMapping = writeFile(outputMapping, mapping).then(() => mapping)

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
