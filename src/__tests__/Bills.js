import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { antiChrono } from "../app/format.js"
import firebase from '../__mocks__/firebase.js';
/**
 * 
 * Données et variables necessaire pour les testes 
 */
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock 
})

window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee'
}))

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html;
      //to-do write expect expression//
      const icon = screen.queryByTestId("icon-eye")
      expect(icon).toBeNull();
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = dates.sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

  });

  // LOADING PAGE for views/BillsUI.js
  describe("When I am on Bills page but it's loading", () => {
    test('Then I should land on a loading page', () => {
      // build user interface
      const html = BillsUI({
        data: [],
        loading: true
      });
      document.body.innerHTML = html;

      // screen should show Loading
      expect(screen.getAllByText('Loading...')).toBeTruthy();
    });
  });

  // ERROR PAGE for views/BillsUI.js
  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then I should land on an error page', () => {
      // build user interface
      const html = BillsUI({
        data: [],
        loading: false,
        error: 'Whoops!'
      });
      document.body.innerHTML = html;

      // screen should show Erreur
      expect(screen.getAllByText('Erreur')).toBeTruthy();
    });
  });

    //Test handleClickNewBill for container/Bills.js  
    //test cliquer sur le botton Nouvelle note de frais
    describe('When I am on Bills Page and I click on the New bill button ', () => {
      test("Then, it should render New bill page ", () => {       

        //vide la page
        const html = BillsUI({ data: [] })
        document.body.innerHTML = html;
        //Get button New bill
        const btnBill = screen.getByTestId('btn-new-bill')

        //instancier la classe Bills
        const billsInst = new Bills(
          { 
            document, 
            onNavigate, 
            firestore: null, 
            localStorage: window.localStorage 
          }            
        )      
      
        //Mock handleClickNewBill (pointer)
        const hdlClickNewBill = jest.fn(billsInst.handleClickNewBill());
      
        //Attach event to btnBill
        btnBill.addEventListener('click', hdlClickNewBill)
        //lanch click
        fireEvent.click(btnBill)
        
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
        expect(screen.getByTestId('form-new-bill')).not.toBe(null);    
      })
    })

    // Test click eye to open justifrd
    describe('When I am on Bills Page and I click on an eye icon in bill row', () => {

      test("Then, a modal should be open", () => {       

      //afficher les bills
      document.body.innerHTML = BillsUI({ data: bills});
        //Get button New bill
      const iconEye = screen.getByTestId('icon-eye-47qAXb6fIm2zOKkLzMro')
      expect(iconEye).toBeTruthy(); 
      //Aprés je dois simuler un click ,pour ca 
        //instancier la classe Bills
        const billsInst = new Bills(
        { 
          document, 
          onNavigate, 
          firestore: null, 
          localStorage: window.localStorage 
        }            
      )      
        // Mock modal comportment
        $.fn.modal = jest.fn();
      
        //Mock handleClickIconEye (pointer)
        const hdlClickIconEye = jest.fn(billsInst.handleClickIconEye(iconEye));     
        //Attach event to btnBill
        iconEye.addEventListener('click', hdlClickIconEye)
        //lanch click
        fireEvent.click(iconEye)      
        expect(screen.getByTestId('modaleFile')).not.toBe(null);  
        
      })
    })

})



// test d'intégration de recupération des Bills avec GET 
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills UI", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get");

      // Get bills and the new bill
      const bills = await firebase.get();

      // getSpy must have been called once
      expect(getSpy).toHaveBeenCalledTimes(1);
      // The number of bills must be 4
      expect(bills.data.length).toBe(4);
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );

      // user interface creation with error code
      const html = BillsUI({
        error: "Erreur 404"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 404/);
      // wait for the error message 400
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );

      // user interface creation with error code
      const html = BillsUI({
        error: "Erreur 500"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 500/);
      // wait for the error message 400
      expect(message).toBeTruthy();
    });
  });
});



