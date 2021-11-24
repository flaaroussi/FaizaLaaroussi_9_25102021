import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"
import { bills } from "../fixtures/bills.js"

export default (billId, billUrl) => {  
  //afficher l'icone eye pour acceder aux justificatifs.
  return (
    `<div class="icon-actions">
      <div id="icon-eye-${billId}" data-testid="icon-eye-${billId}" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
    </div>`
  )  
}