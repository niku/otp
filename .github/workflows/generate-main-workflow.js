const { exec } = require("child_process");

exec("git tag | sort -V", function (error, stdout, stderr) {
  if (error) {{}
    console.log(error.stack);
    process.exit();
  }
  const otpVersions = stdout
    .split("\n")
    .filter((tag) => tag.startsWith("OTP-"))
    .map((tag) => `          - "${tag}"`)
    .join("\n");

  const doc = `name: CI
on: [push]
jobs:
  setup-otp:
    name: A job to setup otp
    strategy:
      matrix:
        os:
          - macos-latest
          # - ubuntu-latest
          # - windows-latest
        otp-version:
${otpVersions}
      fail-fast: false
    runs-on: \${{ matrix.os }}
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          ref: \${{ matrix.otp-version }}
      - name: Setup OTP
        uses: niku/otp-kuroko@master
        with:
          secret-token: \${{ secrets.GITHUB_TOKEN }}
`;
  process.stdout.write(doc);
});
