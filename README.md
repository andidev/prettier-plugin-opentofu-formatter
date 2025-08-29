# @andidev/prettier-plugin-opentofu-formatter

A [Prettier] plugin that formats Terraform files (.tofu, .tf and .tfvars) using the [opentofu fmt] command.

[prettier]: https://github.com/prettier/prettier
[opentofu fmt]: https://opentofu.org/docs/cli/commands/fmt

## Installation

Install the plugin
```console
npm i -D prettier @andidev/prettier-plugin-opentofu-formatter
```

Add plugin to your prettier config
```json
plugins: ['@andidev/prettier-plugin-opentofu-formatter']
```
    
Note that the OpenTofu cli itself is _not installed_ by this tool -- it will attempt to shell out to your local OpenTofu installation each time it decides to format a file. 
You can install OpenTofu from the [official docs](https://opentofu.org/docs/intro/install).

If the formatter can't find or can't execute your local OpenTofu cli, the formatter will ignore tf files silently. You can adjust this behavior using the Options below.


## Options

Add options to your prettier config. Following options are available:

### opentofuStrictError

```json
"opentofuStrictError": false
```

By default, the formatter will shell out to your local opentofu installation. It will treat status code `2` as a syntax error, and any other status code as a failure to launch opentofu, which it will ignore. You can change this option to `true` to treat all non-zero exit codes as a failure.

> *WARNING:* Be careful! By turning on this option, you'll require everyone on your team to install OpenTofu, even those people that don't normally edit OpenTofu files (if they happen to resolve merge conflicts locally, for example, and a OpenTofu file has updated, they could get stuck attempting to run Prettier in a pre-commit hook or similar situation). Only turn this on if you truly want the absence of OpenTofu to be a failure.
