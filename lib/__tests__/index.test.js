const prettier = require('prettier');

const uglyTfFile = `
module "some_module" {
  var1 = 3
  var2         = 4
  var3  =5
}
`;

describe('inferred parser', () => {
  const $env = process.env;

  beforeEach(() => {
    process.env = { ...$env };
  });

  afterEach(() => {
    process.env = $env;
  });

  it('automatically formats .tf file', () => {
    expect(
      prettier.format(uglyTfFile, {
        filepath: 'main.tf',
        plugins: ['.'],
      })
    ).toMatchSnapshot();
  });

  it('when no tofu cli exists on path, fails to format and returns original text', () => {
    process.env.PATH = '';

    expect(
      prettier.format(uglyTfFile, {
        filepath: 'main.tf',
        plugins: ['.'],
      })
    ).toMatchSnapshot();
  });

  it('when no tofu cli exists on path and opentofuStrictError=true, fails', () => {
    process.env.PATH = '';

    expect(() =>
      prettier.format(uglyTfFile, {
        filepath: 'main.tf',
        plugins: ['.'],
        opentofuStrictError: true,
      })
    ).toThrowError(/tofu: No such file or directory/);
  });
});
