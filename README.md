# exercism-javascript-representer

## Installation

Clone this repository and then run:

```bash
yarn install
```

You'll need at least Node LTS for this to work.

```
yarn build
```

## Usage

You can run this either via `yarn`:

```
yarn represent:bat --debug --console two-fer ~/path/to/solution/folder
```

Or directly via the provided shell script:

```
./bin/represent.sh --debug --console two-fer ~/path/to/solution/folder
```

Add the `--debug` and `--console` flags to get output in the terminal window.

### Using docker

To create the image, execute the following command from the repository root:

```bash
docker build -t exercism/javascript-representer .
```

To `run` from docker pass in the solutions path as a volume and execute with the necessary parameters:

```bash
docker run -v $(PATH_TO_SOLUTION):/solution exercism/javascript-representer ${SLUG} /solution
```

Example:

```bash
docker run -v ~/solution-238382y7sds7fsadfasj23j:/solution exercism/javascript-representer two-fer /solution
```

## Tools

We use various tools to maintain this repository and this representer. In order
to contribute to the _code_ of this track, you'll need NodeJS (LTS or higher)
installed, with some of the [`bin/*`][file-bin] files having extra dependencies,
as listed in their file-level commentary.

### `represent` (.sh, .bat)

```shell
./bin/represent.sh two-fer ~/folder/to/solution -dcp
```

This runs the representer using `two-fer` as exercise and a path to a solution.
Most scripts, including this one, accept a wide range of flags to change or
enhance the behaviour, as coded in [`execution_options.ts`][file-execution-options].

Run with the `-h` / `--help` flag to get a list of flags and their description.

```shell
./bin/representer.sh --help
```

You'll most likely want `-dc` (`--debug`,`--console`) during development, which 
enables console output (instead of `stdout`/`stderr`) and shows `logger.log` as 
well as `logger.error` and `logger.fatal`.

### `remote` (.sh, .bat)

```shell
./bin/remote.sh https://exercism.io/tracks/javascript/exercises/two-fer/solutions/df3bb5d7131c44ea9c62206cc8d6c225 -dcp --dry
```

You need the [`exercism` cli][cli] in order for this to work. It takes an 
_exercism solution url_. and downloads it using the `exercism` cli. It then
runs the analyzer on it. 

You'll most likely want `-dcp --dry` (`--debug`, `--console` and `dry run`) 
during development, which enables console output (instead of `stdout`/`stderr`), 
shows `logger.log` as well as `logger.error` and `logger.fatal`, and disables 
writing the output to `representation.txt`.

You can pass the following type of URLs:

- Published solutions: `/tracks/javascript/exercises/<slug>/<id>`
- Mentor solutions: `/mentor/solutions/<id>`
- Your solutions: `/my/solutions/<id>`
- Private solutions: `/solutions/<id>`

[cli]: https://github.com/exercism/cli
