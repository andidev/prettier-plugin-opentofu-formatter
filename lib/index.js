const childProcess = require('child_process');
const path = require('path');

// https://prettier.io/docs/en/plugins.html#languages
const languages = [
  {
    extensions: ['.tf', '.tfvars'],
    type: 'programming',
    name: 'OpenTofu',
    parsers: ['opentofu'],
  },
];

// https://prettier.io/docs/en/plugins.html#parsers
const parsers = {
  opentofu: {
    parse(text, _, opts) {
      // Currently, the BrighterScript formatter isn't designed to produce an intermediate
      // AST, so our parse/print routines are a sham... we are essentially skipping all of
      // Prettier's usual internals by passing the entire source text as a single "node".
      return {
        type: 'full-opentofu-text-node',
        value: text,
      };
    },
    astFormat: 'opentofu-ast',
    locStart: () => 0,
    locEnd: () => 0,
  },
};

// https://prettier.io/docs/en/plugins.html#printers
const printers = {
  'opentofu-ast': {
    print(params, opts) {
      // Unwrap the single expected path (an entire source text node) and format it.
      const node = params.stack[0];

      switch (node.type) {
        case 'full-opentofu-text-node':
          try {
            return childProcess.execSync('tofu fmt -', {
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
              process.exit(1);
            } else {
              if (opts.opentofuStrictError) {
                process.exit(1);
              } else {
                //console.error('Unable to format file with "tofu fmt": ' + errorMessage);
              }
            }
            return node.value;
          }
        default:
          throw new Error('Unknown AST node in file with "tofu fmt": ' + params.type);
      }
    },
  },
};

module.exports = {
  languages,
  parsers,
  printers,
  options: {
    opentofuStrictError: {
      type: 'boolean',
      default: false,
      description:
        'Generate an error if tofu CLI is missing or cannot be executed (defaults to false which means formatting will be skipped silently).',
    },
  },
};
