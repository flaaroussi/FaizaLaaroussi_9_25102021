import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES ,ROUTES_PATH} from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { antiChrono } from "../app/format.js"
import firebase from '../__mocks__/firebase.js';
import Firestore from '../app/Firestore.js';
import Router from "../app/Router";


// LocalStorage - Employee
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
window.localStorage.setItem(
  "user",
  JSON.stringify({
    type: "Employee",
  })
);

// Init onNavigate
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({
    pathname
  });
};

//Tester Bills(containers) et tester fonction antiChrono
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test('Then bill icon in vertical layout should be highlighted', () => {
      // Mock - simulation de la récupération des billes à partir la base firebase

      jest.mock("../app/Firestore");
      Firestore.bills = () => ({ bills,  get: jest.fn().mockResolvedValue() });

      // Pointer sur Bills: '#employee/bills'
      const pathname = ROUTES_PATH["Bills"];
      // build div DOM
      Object.defineProperty(window, "location", {
        value: {
          hash: pathname
        }
      });
      
      document.body.innerHTML = `<div id="root"></div>`;
      // Router init to get actives CSS classes
      Router();
      expect(
        // "icon-window" must contain the class "active-icon"
        screen.getByTestId("icon-window").classList.contains("active-icon")
      ).toBe(true);

    });
   
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = dates.sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

  });


  // Tester Loading Page for views/BillsUI.js
  describe("When I am on Bills page but it's loading", () => {
    test('Then I should be on a loading page', () => {
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

  // Error Page for views/BillsUI.js
  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then I should have an error page', () => {
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
        //vider la page
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
        //La note de frais doit être envoyée
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
        //Le formulaire Nouvelle note des frais doit être affiché
        expect(screen.getByTestId('form-new-bill')).not.toBe(null);    
      })
    })

    // Test click eye to open justificatif
    describe('When I am on Bills Page and I click on an eye icon in bill row', () => {

      test("Then, a modal should be open", () => {       

      //afficher les bills
      document.body.innerHTML = BillsUI({ data: bills});
      //Get button New bill
      const iconEye = screen.getByTestId('icon-eye-47qAXb6fIm2zOKkLzMro')
      expect(iconEye).toBeTruthy(); 
        //Aprés je dois simuler un click ,pour ca je dois
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
        //La modal dont le justificatif est affiché doit être visible
        expect(screen.getByTestId('modaleFile')).not.toBe(null);  
        
      })
    })

})



// test d'intégration de recupération des Bills avec GET 
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills UI", () => {
    test("then  API GET fetches (récupere) 4 bills", async () => {
      const getSpy = jest.spyOn(firebase, "get");

      // Get bills and the new bill
      const bills = await firebase.get();

      // getSpy must have been called once
      expect(getSpy).toHaveBeenCalledTimes(1);
      // The number of bills must be 4
      expect(bills.data.length).toBe(4);
    });

    test("then should API return 404 message error when it doesn't fetches bills", async () => {
      //simulation d'erreur 404(page introuvable)
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );

      // user interface creation with error code
      const html = BillsUI({
        error: "Erreur 404"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 404/);
      // wait for the error message 404
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
      // wait for the error message 500
      expect(message).toBeTruthy();
    });
  });
});



