import yargs from 'yargs'

export class ExecutionOptionsImpl implements ExecutionOptions {
  public debug!: boolean
  public console!: boolean
  public output!: { representation: string; mapping: string }
  public inputDir!: string
  public outputDir!: string
  public exercise!: string
  public dry!: boolean
  public noTemplates!: boolean
  public pretty!: boolean

  constructor(options: ExecutionOptions) {
    Object.assign(this, options)
  }

  public static create(): ExecutionOptions {
    const args = yargs
      .usage(
        'Usage: $0 <exercise> <input-directory> [<output-directory>] [options]'
      )
      .example(
        '$0 two-fer ~/javascript/two-fer/128/',
        'Represent the two-fer solution from the input directory "128"'
      )
      .alias('d', 'debug')
      .alias('c', 'console')
      .alias('or', 'output_representation')
      .alias('om', 'output_mapping')
      .alias('u', 'ugly')
      .describe('d', 'Unless given, only outputs warnings and errors')
      .describe('c', 'If given, outputs to the console')
      .describe(
        'or',
        'Path relative to the output dir where the representation is stored'
      )
      .describe(
        'om',
        'Path relative to the output dir where the mapping is stored'
      )
      .describe(
        'noTemplates',
        'Unless given, exports templates instead of messages (feature flag)'
      )
      .describe(
        'u',
        'If given, does not format the JSON output using 2 space indentation'
      )
      .describe('dry', 'If given, does not output anything to disk')
      .boolean(['d', 'c', 'p', 'u', 'dry', 'noTemplates'])
      .string('or')
      .string('om')
      .default('d', process.env.NODE_ENV === 'development')
      .default('c', process.env.NODE_ENV === 'development')
      .default('noTemplates', false)
      .default('p', true)
      .default('u', false)
      .default('or', './representation.txt')
      .default('om', './mapping.json')
      .default('dry', false)
      .help('h')
      .alias('h', 'help').argv

    const { d, c, or, om, dry, p, u, noTemplates, _ } = args

    return new ExecutionOptionsImpl({
      debug: d,
      console: c,
      output: { representation: or, mapping: om },
      pretty: u === true ? false : p,
      dry,
      noTemplates,
      exercise: String(_[0]),
      inputDir: String(_[1]),
      outputDir: String(_[2] || _[1]),
    })
  }
}
