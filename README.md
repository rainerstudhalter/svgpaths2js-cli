# svgpaths2js-cli

Convert an entire svg to path elements, optionally sorted by ids, and output them to a json, js, or ts file

## Install

`npm i -g svgpaths2js`

## Usage

`svgpaths2js <input-file> [options]`

## Arguments

| Argument                | Description         |
| :--------------------   | :-----------        |
| `<input file>`          | path to input file  |

## Options

| Option                  | Description                                                        |
| :--------------------   | :-----------                                                       |
| `-f, --format <format>` | output file format (choices: "json", "js", "ts", default: "json")  |
| `-t, --type <type>`     | type of output data (choices: "array", "object", default: "array") |
| `-a, --sort-ids-asc`    | sort paths by ids ascending                                        |
| `-d, --sort-ids-desc`   | sort paths by ids descending                                       |
| `-h, --help`            | show help                                                          |

## Todo
- Tests

## License

[MIT](LICENSE)