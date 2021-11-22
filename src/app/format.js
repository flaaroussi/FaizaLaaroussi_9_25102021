export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  //ajout controle:date valide
  if(!date.getDate()){
    return "";
  }
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}



export const antiChrono = (bill1, bill2) => {
  return bill1.date < bill2.date ? 1 : -1;  
};



export const getDocsData = (docs) =>{
  const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : ""
  return docs
  .map(doc => {
    try {
      return {...doc.data(), date: doc.data().date, status: formatStatus(doc.data().status)}
    } catch(e) {
      // if for some reason, corrupted data was introduced, we manage here failing formatDate function
      // log the error and return unformatted date in that case
      return {...doc.data(), date: doc.data().date, status: formatStatus(doc.data().status)}
    }
  }).filter(bill => bill.email === userEmail)
  
}
