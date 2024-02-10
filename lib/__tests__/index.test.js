const prettier = require('prettier');

const uglyTerraform = `
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

  it('automatically formats Terraform', () => {
    expect(
      prettier.format(uglyTerraform, {
        filepath: 'main.tf',
        plugins: ['.'],
      })
    ).toMatchSnapshot();
  });

  it('when no Terraform exists on path, fails to format and returns original text', () => {
    process.env.PATH = '';

    expect(
      prettier.format(uglyTerraform, {
        filepath: 'main.tf',
        plugins: ['.'],
      })
    ).toMatchSnapshot();
  });

  it('when no Terraform exists on path and terraformStrictError=true, fails', () => {
    process.env.PATH = '';

    expect(() =>
      prettier.format(uglyTerraform, {
        filepath: 'main.tf',
        plugins: ['.'],
        terraformStrictError: true,
      })
    ).toThrowError(/terraform: No such file or directory/);
  });
});
