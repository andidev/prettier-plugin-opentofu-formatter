# prettier-plugin-terraform-formatter

A [Prettier] plugin that formats Terraform files using the [terraform fmt] command.

[prettier]: https://github.com/prettier/prettier
[terraform fmt]: https://developer.hashicorp.com/terraform/cli/commands/fmt

## Installation

```console
npm i -D prettier prettier-plugin-terraform-formatter
```

Note that the Terraform tool itself is _not installed_ by this tool -- it will attempt to shell out to your local Terraform installation each time it decides to format a file. You can install Terraform from the official docs, or use a version manager like [tfenv](https://github.com/tfutils/tfenv) or [tfswitch](https://github.com/warrensbox/terraform-switcher).

If the formatter can't find or can't execute your local Terraform, the formatter will ignore tf files silently. You can adjust this behavior using the Options below.


## Options

### terraformStrictError

```json
{
  "terraformStrictError": false
}
```

By default, the formatter will shell out to your local terraform installation. It will treat status code `2` as a syntax error, and any other status code as a failure to launch terraform, which it will ignore. You can change this option to `true` to treat all non-zero exit codes as a failure.

> *WARNING:* Be careful! By turning on this option, you'll require everyone on your team to install Terraform, even those people that don't normally edit Terraform files (if they happen to resolve merge conflicts locally, for example, and a Terraform file has updated, they could get stuck attempting to run Prettier in a pre-commit hook or similar situation). Only turn this on if you truly want the absence of Terraform to be a failure.
