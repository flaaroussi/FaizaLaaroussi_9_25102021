import NewBill from '../containers/NewBill.js';
import NewBillUI from '../views/NewBillUI.js';
import { ROUTES } from '../constants/routes.js';

import { localStorageMock } from '../__mocks__/localStorage.js';

import { fireEvent, screen } from '@testing-library/dom';

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});


window.localStorage.setItem(
  'user',
  JSON.stringify({
    type: 'Employee',
  })
);

describe('Given i am logged as an employee', () => {  
  describe('When I am on NewBill page and I choose a file with .jpg, .jpeg or .png extension', () => {    
    test('Then the error message should not apparear', () => {    

      document.body.innerHTML = NewBillUI();
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        firestore : null,
        localStorage: window.localStorage,
      });

      const fileInput = screen.getByTestId('file');
      //Mock handleChangeFile (pointer)(simuler la fct pour qu'elle reproduit le comportement
      //de l'objet réel )
      const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);

     
      fileInput.addEventListener('change', handleChangeFile);
      //lancer la manipulation
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['image.png'], 'image.png', { type: 'image/png' })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(fileInput.files[0].name).toBe('image.png');

    });
  });
});