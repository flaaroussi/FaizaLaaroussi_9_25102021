import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus, getDocsData } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-bill-url]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', (e) => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = e => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    //ajuster l'affichage de l'image dans la modal
    const imgWidth = Math.floor($('#modaleFile').width() * 0.4)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} /></div>`)
    //si la fonction  existe
    $('#modaleFile').modal('show')
  }

  // not need to cover this function by tests
  getBills = () => { 
    if (this.firestore) {
      return this.firestore
      .bills()
      .get()
      .then(snapshot => {
        return getDocsData(snapshot.docs)        
      })
      .catch(error => error)
    }
  }

  

}

