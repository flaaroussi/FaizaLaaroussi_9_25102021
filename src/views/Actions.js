import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

export default (billUrl) => {
  //afficher l'icone eye pour les justificatifs de type png,jpeg et jpg.
  if(billUrl){
    const url = billUrl.toLowerCase();
    if (url.includes(".png") || url.includes(".jpeg") || url.includes(".jpg")) {
        return (
          `<div class="icon-actions">
            <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
            ${eyeBlueIcon}
            </div>
          </div>`
        )
    }
  }   
 
    return "";
  
}