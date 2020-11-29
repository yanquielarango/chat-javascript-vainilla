const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector("#nombreUsuario")
const contenidoWeb = document.querySelector('#contenidoWeb')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged( (user) => {
  if(user) {
    console.log(user)
    botones.innerHTML =  /*html*/`
      <button class="btn btn-outline-danger"  id="btnCerrarSeccion">Cerrar Sesion</button>`

      nombreUsuario.innerHTML = user.displayName
      cerrarSeccion()
      
      formulario.classList = `input-group py-3 fixed-bottom container `
      contenidoChat(user)
  } else {
    console.log('no exisete user')
    botones.innerHTML =  /*html*/`
    <button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button>`
  
    iniciarSeccion()
    nombreUsuario.innerHTML = "Chat-JavaScript-Vainilla"
    contenidoWeb.innerHTML =  /*html*/`<p class="text-center lead mt-5">Debes iniciar sesion</p>`

    formulario.classList = `input-group py-3 fixed-bottom container d-none`
}
}) 

const contenidoChat = (user) => {

  
      formulario.addEventListener('submit', (e) => {
      e.preventDefault()
     // console.log(inputChat.value)


      if(!inputChat.value.trim()) {
          console.log('input vacio')
          return
      }

      firebase.firestore().collection('chat').add({
        texto: inputChat.value,
        uid: user.uid,
        fecha: Date.now()
      })
      .then(res => {console.log('mensaje guardado')})
      .catch(error => console.log(error))

      inputChat.value = ''
  })

   firebase.firestore().collection('chat').orderBy('fecha')
    .onSnapshot(query => {
    //console.log(query)
    contenidoWeb.innerHTML = ''
    query.forEach(doc => {
      console.log(doc.data())
        if(doc.data().uid === user.uid) {
          contenidoWeb.innerHTML += `<div class=" d-flex justify-content-end mb-2">
          <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
        </div></main>`
        } else {
          contenidoWeb.innerHTML += `<div class=" d-flex justify-content-start mb-2">
          <span class="badge badge-pill badge-secondary">${doc.data().texto}</span>
        </div></main>`
        }
          
       
       /*  contenidoWeb.scrollTop = contenidoWeb.scrollHeight */
    })
  })
 
}

const cerrarSeccion = () => {
  const btnCerrarSeccion = document.querySelector('#btnCerrarSeccion')
  btnCerrarSeccion.addEventListener("click", () => {
    firebase.auth().signOut()
  })
}

const iniciarSeccion = () => {
const btnAcceder = document.querySelector("#btnAcceder")
btnAcceder.addEventListener('click', async() => {
  console.log('me click')
  try {
      const provider = new firebase.auth.GoogleAuthProvider()
      await firebase.auth().signInWithPopup(provider)

  } catch (error) {
    console.log(error)
  }
})
}
