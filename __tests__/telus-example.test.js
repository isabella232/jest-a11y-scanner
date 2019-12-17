const { configureAxe, axe, toHaveNoViolations, reportViolations } = require('../src/index.js')

expect.extend(toHaveNoViolations)

describe("Telus test series", () => {
  it('should log output, but never error', async () => {
    const render = () => `
      <div>
        <img src="#"/>
      </div>
    `

    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    expect(results).toHaveNoViolations(false)
  })
  it.only('should error and log output', async () => {
    const render = () => `
      <div>
        <img src="#"/>
      </div>
    `

    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    expect(results).toHaveNoViolations(false, false)
  })
  it('should report violations', async () => {
    const render = () => `
      <div>
        <img src="#"/>
      </div>
    `

    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html);

    reportViolations(results, "./report.txt");
  })
  it('should have empty report violations', async () => {
    const render = () => `
      <div>
        <img src="#"/>
      </div>
    `

    // pass anything that outputs html to axe
    const html = render()

    const results = await axe(html, {
      rules: {
        // for demonstration only, don't disable rules that need fixing.
        'image-alt': { enabled: false }
      }
    })

    reportViolations(results, "./empty_report.txt");
  })
})