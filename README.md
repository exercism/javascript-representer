# @exercism/javascript-representer

[![javascript-representer / deploy](https://github.com/exercism/javascript-representer/actions/workflows/deploys.yml/badge.svg)](https://github.com/exercism/javascript-representer/actions/workflows/deploys.yml)
[![javascript-representer / main](https://github.com/exercism/javascript-representer/actions/workflows/ci.js.yml/badge.svg)](https://github.com/exercism/javascript-representer/actions/workflows/ci.js.yml)

## Installation

Clone this repository and then run:

```bash
yarn install
```

You'll need at least Node LTS for this to work.

```bash
yarn build
```

## Global installation

If you want to use this package as a local tool, you can install it globally, in order to make the "binaries" available:

```shellscript
yarn global add @exercism/javascript-representer
```

On \*nix systems or enabled shells (wsl, bash, git bash, etc.) you can now use `javascript-representer <slug> <input> [<output>] [-flag] [--flags]` to represent a local file (at `input`), or
`javascript-representer-remote https://exercism.org/... [<output>] [-flag] [--flags]` to work on a remote solution.

## Usage

If you're developing this, you can run this via `yarn` or the provided shell script.

- `.sh` enabled systems (UNIX, WSL): `yarn represent:dev`
- `.bat` fallback (cmd.exe, Git Bash for Windows): `yarn represent:dev:bat`

You'll want these `:dev` variants because it will _build_ the required code (it will transpile from TypeScript to JavaScript, which is necessary to run this in Node environments, unlike Deno environments).
When on Windows, if you're using Git Bash for Windows or a similar terminal, the `.sh` files will work, but will open a new window (which closes after execution).
The `.bat` scripts will work in the same terminal.

You can also manually build using `yarn` or `yarn build`, and then run the script directly: `./bin/represent.sh arg1 -o2 --option3`.

Run this with the argument `help` to see how to use this:

```shell
yarn represent:dev:bat help

Usage | represent.js <exercise> <input-directory> [<output-directory>] [options]

Options:
 ... see below

Examples:
  represent.js two-fer ~/javascript/two-fer/128/

  Represent the two-fer solution from the input directory "~/javascript/two-fer/128"
```

### Options

| short  | long                      | description                                                         |                                              |
| ------ | ------------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
|        | `--version`               | Show version number                                                 | `boolean`                                    |
| `-d`   | `--debug`                 | Unless given, only outputs warnings and errors                      | `boolean` (default: `false`)                 |
| `-c`   | `--console`               | If given, outputs to the console                                    | `boolean` (default: `false`)                 |
| `--or` | `--output_representation` | Path relative to the output dir where the representation is stored  | `string` (default: `"./representation.txt"`) |
| `--om` | `--output_mapping`        | Path relative to the output dir where the mapping is stored         | `string` (default: `"./mapping.json"`)       |
| `-u`   | `--ugly`                  | If given, does not format the JSON output using 2 space indentation | `boolean` (default: `false`)                 |
|        | `--dry`                   | If given, does not output anything to disk                          | `boolean` (default: `false`)                 |
| `-h`   | `--help`                  | Show help                                                           | `boolean`                                    |

When using development, likely you'll want `-dc` to _also_ print the output and debug message to the console.
You can use `--dry` to prevent the script from writing to disk.
When the `<output-directory>` is not given, it default to the given `<input-directory>`

## Remote solutions

There are tools provided to run the representer on remote solutions.

- `.sh` enabled systems (UNIX, WSL): `bin/scripts/remote.sh url`
- `.bat` fallback (cmd.exe, Git Bash for Windows): `bin\scripts\remote.bat url`

You can pass the following type of URLs:

- ~~Published solutions: `/tracks/javascript/exercises/<slug>/<id>`~~
- ~~Mentor solutions: `/mentor/solutions/<id>`~~
- ~~Your solutions: `/my/solutions/<id>`~~
- ~~Private solutions: `/solutions/<id>`~~
- Constructed urls: `/solutions/<uid>` (use the download button when mentoring)

## Using docker

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

## Formatting code

The easiest way to satisfy the code-format linter is to add a comment to your PR:

```text
/format
```

Alternatively, run the following command:

```shell
bin/format.sh
```
