import type { Input } from '@exercism/static-analysis'

export interface ExecutionOptions {
  /** If true, logger.debug messages are displayed */
  debug: boolean
  /** If true, logger messages are sent to the console */
  console: boolean
  /** If true, does a dry run and does not output anything to file */
  dry: boolean
  /** The output file name */
  output: { representation: string; mapping: string; stdout?: string }
  /** The input directory path */
  inputDir: string
  /** The output directory path */
  outputDir: string
  /** The exercise slug */
  exercise: string
  /** If true, outputs the JSON using 2 space-indentation (pretty-print) */
  pretty: boolean
}

export interface Exercise {
  readonly slug: string
}

export interface Output {
  /**
   * Makes the output ready to be processed
   * @param options the execution options
   * @returns the output as string
   */
  toProcessable(
    options: Readonly<ExecutionOptions>
  ): Promise<{ representation: string; mapping: string }>
}

export interface OutputProcessor {
  (
    previous: Promise<Readonly<{ representation: string; mapping: string }>>,
    options: Readonly<ExecutionOptions>
  ): Promise<{ representation: string; mapping: string }>
}

export interface Representer {
  run(input: Input): Promise<Output>
}

export interface Runner {
  call(
    representer: Representer,
    input: Input,
    options: Readonly<ExecutionOptions>
  ): Promise<Output>
}
