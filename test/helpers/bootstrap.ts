import { Logger, setProcessLogger } from '@exercism/static-analysis'
import { ExerciseImpl } from '~src/ExerciseImpl'
import { ExecutionOptions } from '~src/interface'
import { BootstrapResult } from '~src/utils/bootstrap'
import { ExecutionOptionsImpl } from '~src/utils/execution_options'

export function bootstrap({
  exercise,
  ...overrides
}: { exercise: string } & Partial<ExecutionOptions>): Omit<
  BootstrapResult,
  'input'
> {
  const options = new ExecutionOptionsImpl({
    debug: false,
    console: false,
    output: {
      representation: '__fake__.representation',
      mapping: '__fake__.mapping',
    },
    outputDir: '__fake__',
    inputDir: '__fake__',
    dry: true,
    pretty: true,
    exercise,
    ...overrides,
  })

  const logger = setProcessLogger(new Logger(options))

  return {
    options,
    exercise: new ExerciseImpl(exercise),
    logger,
  }
}
