export async function setup() {}

export async function teardown() {
  if (process.env.CI === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    process.exit(process.exitCode ?? 0);
  }
}
