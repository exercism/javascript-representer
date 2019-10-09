import { Bootstrap } from '~src/utils/bootstrap'
import { RepresenterImpl } from '~src/representer/RepresenterImpl'
import { run } from '~src/utils/runner'

// The bootstrap call uses the arguments passed to the process to figure out
// which exercise to target, where the input lives (directory input) and what
// execution options to set.
//
// represent -dc two-fer ~/test/
//
// For example, if arguments are passed directly, the above will run the 
// representer looking for two-fer input with the ~/test/ input directory and 
// turning on debug and console logging.
//
const { exercise, options, input, logger } = Bootstrap.call()

logger.log('=> DEBUG mode is on')
logger.log(`=> exercise: ${exercise.slug}`)
logger.log(`=> options: ${options.dry ? 'dry ' : ''}`)

const representer = new RepresenterImpl()

// The runner uses the execution options to determine what should happen with
// the output. For example the --dry flag will make sure there is nothing
// written to a file.
//
// The basis for the runner is calling analyzer.run(input) -- the output is then
// logged and/or written to a file.
//
run(representer, input, options)
  .then((): never => process.exit(0))
  .catch((err): never => logger.fatal(err.toString()))

