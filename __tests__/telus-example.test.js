const { configureAxe, axe, toHaveNoViolations, reportViolations } = require('../src/index.js')

expect.extend(toHaveNoViolations)

describe("Telus test series", () => {
  const render = () => `
    <div>
      <img src="#"/>
    </div>
  `
  it('should error and log output', async () => {
    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    expect(results).toHaveNoViolations()
  })
  it('should log output, but never error', async () => {
    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    expect(results).toHaveNoViolations({ error: false })
  })
  it('should error and log concise output', async () => {
    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    expect(results).toHaveNoViolations({ verbose: false })
  })
  it('should not error and log concise output', async () => {
    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    expect(results).toHaveNoViolations({ error: false, verbose: false })
  })
  it('should report violations', async () => {
    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    reportViolations(results, "./report");
  })
  it('should append report violations', async () => {
    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    reportViolations(results, "./append-report", true);
  })
  it('should have empty report violations', async () => {
    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html, {
      rules: {
        // for demonstration only, don't disable rules that need fixing.
        'image-alt': { enabled: false }
      }
    })

    reportViolations(results, "./empty_report");
  })
})