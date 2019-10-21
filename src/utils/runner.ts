import { LogOutput } from '../output/processor/LogOutput'
import { FileOutput } from '../output/processor/FileOutput'
import { PassThroughOutput } from '../output/processor/PassThroughOutput'

/**
 * Run a specific representer, given a set of execution options
 *
 * @param representer the representer to run
 * @param input the input (source of the solution)
 * @param options the options
 *
 * @returns the output
 *
 */
export async function run(
  representer: Representer,
  input: Input,
  options: ExecutionOptions
): Promise<Output> {
  // This actually runs the representer and is the bases for any run. The options
  // currently only affect the output.
  const analysis = await representer.run(input)

  // An output processor gets the Promise to the previous output processor and
  // can add its own side-effects or transformation.
  const processors: OutputProcessor[] = [
    // Sends the output to the logger
    LogOutput,

    // Sends the output to a file
    options.dry ? PassThroughOutput : FileOutput,
  ]

  return process(options, analysis, ...processors)
}

async function process(
  options: Readonly<ExecutionOptions>,
  analysis: Output,
  ...processors: OutputProcessor[]
): Promise<Output> {
  await processors.reduce(
    (previous, processor) => processor(previous, options),
    analysis.toProcessable(options)
  )
  return analysis
}
