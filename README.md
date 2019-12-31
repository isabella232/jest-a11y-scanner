# jest-a11y-scanner

## Installation

Add the `jest-a11y-scanner-4.2.0.tgz` file to the root of your project in the same folder as your `package.json`

Install using the command below:

```bash
npm install --save-dev jest-a11y-scanner-4.2.0.tgz
```

## Usage

Running `toHaveNoViolations` with no additional options will use the default options.
These are: emitting error on test failure, verbose output, and writing results to a "jest-a11y-reports" directory when complete.

```javascript
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')

expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage', async () => {
  const render = () => '<img src="#"/>'

  // pass anything that outputs html to axe
  const html = render()

  expect(await axe(html)).toHaveNoViolations()
})
```

![Screenshot of the resulting output from the usage example](example-cli.png)

> Note, you can also require `'jest-a11y-scanner/extend-expect'` which will call `expect.extend` for you.
> This is especially helpful when using the jest `setupTestFrameworkScriptFile` configuration.

### Custom Parameters

You can turn erroring off by setting the "error" flag to fals in the options of `toHaveNoViolations` if you want to output violations without failing tests. This is useful if you are encountering a lot of errors and they are preventing you from committing to CI.

```javascript
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')

expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with erroring off', async () => {
  const render = () => '<img src="#"/>'

  const html = render()

  // Pass false to prevent erroring, default is true when nothing is passed
  expect(await axe(html)).toHaveNoViolations({ error: false })
})
```

You can reduce the verbosity of output by setting the "verbose" flag to false in the options of `toHaveNoViolations` if you want to shorten the output of failing tests. This is useful if you are encountering a lot of errors and you want to clear up the console.

```javascript
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')

expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with erroring off', async () => {
  const render = () => '<img src="#"/>'

  const html = render()

  // Pass false to restrict output verbosity, default is true when nothing is passed
  expect(await axe(html)).toHaveNoViolations({ verbose: false })
})
```

If you don't want to write to file when the test is run, you can set the "report" flag to false in the options of `toHaveNoViolations`. Reports are default written to the "jest-a11y-reports" directory in the current working directory called "report-{timestamp}.txt" with duplicates given an incrementing number at the end of the filename. If the "jest-a11y-reports" directory doesn't exist, one will be created.

```javascript
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')

expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with erroring off', async () => {
  const render = () => '<img src="#"/>'

  const html = render()

  // Pass false to prevent to writing to file, default is true when nothing is passed
  expect(await axe(html)).toHaveNoViolations({ report: false })
})
```

You may also use these option flags in any combination when calling `toHaveNoViolations`. Such as `expect(await axe(html)).toHaveNoViolations({ error: false, verbose: false })`. Since the report flag is omitted, it will default to true.
All flags default to true when omitted from the "options" object.

### Writing Output to File

If you are in a test and you want to write the axe results to a specific file, you can pass the axe results to the `reportViolations` function with a path to a file. This function will automatically add the ".txt" extension for you.

```javascript
const { axe, reportViolations } = require('jest-a11y-scanner')

it('writes to file', async () => {
  const render = () => '<img src="#"/>'

  const html = render()

  reportViolations(await axe(html), "./out_file.txt");
})
```

This should write out a report similar to this:

```text
Report Date: Fri Dec 20 2019 10:45:06 GMT-0500 (Eastern Standard Time)

Axe-Core Version: 3.4.0

────────

Expected the HTML found at $('img') to have no violations:

<img src="#">

Received:

Images must have alternate text (image-alt)

Fix any of the following:
  Element does not have an alt attribute
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute or the title attribute is empty
  Element's default semantics were not overridden with role="presentation"
  Element's default semantics were not overridden with role="none"

You can find more information on this issue here:
https://dequeuniversity.com/rules/axe/3.4/image-alt?application=axeAPI
```

If you would like to append to an existing file, you can pass "true" to the `append` parameter of `reportViolations`. Default is false.

```javascript
const { axe, reportViolations } = require('jest-a11y-scanner')

it('writes to file', async () => {
  const render = () => '<img src="#"/>'

  const html = render()

  // pass true as the third parameter to append, default is false
  reportViolations(await axe(html), "./out_file.txt", true);
})
```

### Testing React

```javascript
const React = require('react')
const { render } =  require('react-dom')
const App = require('./app')

const { axe, toHaveNoViolations } = require('jest-a11y-scanner')
expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with react', async () => {
  render(<App/>, document.body)
  const results = await axe(document.body)
  expect(results).toHaveNoViolations()
})
```

### Testing React with [Enzyme](https://airbnb.io/enzyme/)

Sometimes you will get errors on react code with child nodes like `<MyComponent {props} />` when using Enzyme's `shallow` method. If that is the case, you may want to use the `mount` method shown below.

```javascript
const React = require('react')
const App = require('./app')

const { mount } = require('enzyme')
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')
expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with enzyme', async () => {
  const wrapper = mount(<App/>)
  const results = await axe(wrapper.getDOMNode())
  
  expect(results).toHaveNoViolations()
})
```

### Testing React with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

```javascript
const React = require('react')
const App = require('./app')

const { render, cleanup } = require('@testing-library/react')
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')
expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with react testing library', async () => {
  const { container } = render(<App/>)
  const results = await axe(container)
  
  expect(results).toHaveNoViolations()
  
  cleanup()
})
```

> Note: If you're using `react testing library` you should be using the
> [`cleanup`](https://testing-library.com/docs/react-testing-library/api#cleanup) method. This method removes the rendered application from the DOM and ensures a clean HTML Document for further testing.

### Testing Vue with [Vue Test Utils](https://vue-test-utils.vuejs.org/)

```javascript
const App = require('./App.vue')

const { mount } = require('@vue/test-utils')
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')
expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with vue test utils', async () => {
  const wrapper = mount(Image)
  const results = await axe(wrapper.element)

  expect(results).toHaveNoViolations()
})
```

### Testing Vue with [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro)

```javascript
const React = require('react')
const App = require('./app')

const { render, cleanup } = require('@testing-library/vue')
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')
expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with react testing library', async () => {
  const { container } = render(<App/>)
  const results = await axe(container)
  
  expect(results).toHaveNoViolations()
  
  cleanup()
})
```

> Note: If you're using `vue testing library` you should be using the
> [`cleanup`](https://testing-library.com/docs/vue-testing-library/api#cleanup) method. This method removes the rendered application from the DOM and ensures a clean HTML Document for further testing.

### Axe configuration

The `axe` function allows options to be set with the [same options as documented in axe-core](https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#options-parameter):

```javascript
const { axe, toHaveNoViolations } = require('jest-a11y-scanner')

expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with a custom config', async () => {
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

  expect(results).toHaveNoViolations()
})
```

## Setting global configuration

If you find yourself repeating the same options multiple times, you can export a version of the `axe` function with defaults set.

Note: You can still pass additional options to this new instance; they will be merged with the defaults.

This could be done in [Jest's setup step](https://facebook.github.io/jest/docs/en/setup-teardown.html)

```javascript
// Global helper file (axe-helper.js)
const { configureAxe } = require('jest-a11y-scanner')

const axe = configureAxe({
  rules: {
    // for demonstration only, don't disable rules that need fixing.
    'image-alt': { enabled: false }
  }
})

module.exports = axe
```

```javascript
// Individual test file (test.js)
const { toHaveNoViolations } = require('jest-a11y-scanner')
const axe = require('./axe-helper.js')

expect.extend(toHaveNoViolations)

it('should demonstrate this matcher`s usage with a default config', async () => {
  const render = () => `
    <div>
      <img src="#"/>
    </div>
  `

  // pass anything that outputs html to axe
  const html = render()

  expect(await axe(html)).toHaveNoViolations()
})
```
