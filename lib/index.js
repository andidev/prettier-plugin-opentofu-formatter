const childProcess = require('child_process');

// https://prettier.io/docs/en/plugins.html#languages
const languages = [
  {
    extensions: ['.tf'],
    type: 'programming',
    name: 'Terraform',
    parsers: ['terraform'],
  },
];

// https://prettier.io/docs/en/plugins.html#parsers
const parsers = {
  terraform: {
    parse(text, _, opts) {
      // Currently, the BrighterScript formatter isn't designed to produce an intermediate
      // AST, so our parse/print routines are a sham... we are essentially skipping all of
      // Prettier's usual internals by passing the entire source text as a single "node".
      return {
        type: 'full-terraform-text-node',
        value: text,
      };
    },
    astFormat: 'terraform-ast',
    locStart: () => 0,
    locEnd: () => 0,
  },
};

// https://prettier.io/docs/en/plugins.html#printers
const printers = {
  'terraform-ast': {
    print(path, opts) {
      // Unwrap the single expected path (an entire source text node) and format it.
      const node = path.stack[0];

      switch (node.type) {
        case 'full-terraform-text-node':
          try {
            return childProcess.execSync('terraform fmt -', {
              encoding: 'utf8',
              input: node.value,
              env: process.env,
            });
          } catch (error) {
            let errorMessage = error.stderr;

            if (errorMessage && opts.filepath) {
              errorMessage = errorMessage.replace(/<stdin>/g, opts.filepath);
            }

            if (error && error.status === 2) {
              throw new Error('Syntax error: ' + errorMessage);
            } else {
              if (opts.terraformStrictError) {
                throw new Error('Unable to format Terraform file: ' + errorMessage);
              } else {
                console.error('Unable to format Terraform file: ' + errorMessage);
              }
            }
            return node.value;
          }
        default:
          throw new Error('Unknown AST node in Terraform file: ' + path.type);
      }
    },
  },
};

module.exports = {
  languages,
  parsers,
  printers,
  options: {
    terraformStrictError: {
      type: 'boolean',
      default: false,
      description:
        'Generate an error if Terraform is missing or cannot be executed (defaults to ignoring terraform files).',
    },
  },
};
