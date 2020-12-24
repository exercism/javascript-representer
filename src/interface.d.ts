interface ExecutionOptions {
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

interface AstParser<T extends unknown> {
  /**
   * Parse an input to an Abstract Syntax Tree
   * @param input the input
   * @returns the AST
   */
  parse(input: Input): Promise<T>
}

interface Input {
  /**
   * Read in a number of strings
   * @param n the number
   * @returns at most `n` strings
   */
  read(n?: number): Promise<string[]>
}

interface Exercise {
  readonly slug: string
}

interface Output {
  /**
   * Makes the output ready to be processed
   * @param options the execution options
   * @returns the output as string
   */
  toProcessable(
    options: Readonly<ExecutionOptions>
  ): Promise<{ representation: string; mapping: string }>
}

interface OutputProcessor {
  (
    previous: Promise<Readonly<{ representation: string; mapping: string }>>,
    options: Readonly<ExecutionOptions>
  ): Promise<{ representation: string; mapping: string }>
}

interface Representer {
  run(input: Input): Promise<Output>
}

interface Runner {
  call(
    representer: Representer,
    input: Input,
    options: Readonly<ExecutionOptions>
  ): Promise<Output>
}
