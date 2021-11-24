import { screen } from "@testing-library/dom"
import Actions from "../views/Actions.js"
import '@testing-library/jest-dom/extend-expect'


describe('Given I am connected as an Employee', () => {
  describe('When I am on Bills page and there are bills', () => {
    test(('Then, it should render icon eye'), () => {
      // avant >> const html = Actions()
      const html = Actions("xyz", "test.png")
      document.body.innerHTML = html
      // est ce que l'icon est present dans le screen
      expect(screen.getByTestId('icon-eye-xyz')).toBeTruthy()
    })
  })
  

  describe('When I am on Bills page and there are bills with url for file', () => {
    test(('Then, it should save given url in data-bill-url custom attribute'), () => {
      const url = '/fake_url.png'
      const html = Actions('xyz',url)
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-eye-xyz')).toHaveAttribute('data-bill-url', url)
    })
  })
})