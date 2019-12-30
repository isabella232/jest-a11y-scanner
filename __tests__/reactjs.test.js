const { axe, toHaveNoViolations } = require('../src/index.js')

const React = require('react')
const ReactDOMServer = require('react-dom/server')

expect.extend(toHaveNoViolations)

describe('React', () => {

  test('renders correctly', async () => {
    const element = React.createElement('img', { src: '#' })
    const html = ReactDOMServer.renderToString(element)

    const results = await axe(html)
    expect(() => {
      expect(results).toHaveNoViolations()
    }).toThrowErrorMatchingSnapshot()
  })

  test('renders a react testing library container correctly', async () => {
    const { render, cleanup } = require('@testing-library/react')

    const element = React.createElement('img', { src: '#' })
    const { container } = render(element)
    const results = await axe(container)
    
    expect(() => {
      expect(results).toHaveNoViolations()
    }).toThrowErrorMatchingSnapshot()

    cleanup()
  })

  test('renders a react testing library container without duplicate ids', async () => {
    const { render, cleanup } = require('@testing-library/react')

    const element = React.createElement('img', { src: '#', alt: 'test', id: 'test' })
    const { container } = render(element)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
    
    cleanup()
  })

  test('renders with enzyme wrapper correctly', async () => {
    const { mount, configure, shallow } = require('enzyme')
    const Adapter = require('enzyme-adapter-react-16')

    configure({ adapter: new Adapter() })

    const element = React.createElement('img', { src: '#' })
    const wrapper = shallow(element)
    const results = await axe(wrapper.html())

    expect(results).not.toHaveNoViolations()
  })

})