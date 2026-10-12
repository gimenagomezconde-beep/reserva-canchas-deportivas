import {
    getAuth,
    onAuthStateChanged,
    signOut,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyDuGP9bNWlLejROBDqnmFl4mo9BAKrpQCU",
    authDomain: "sistema-de-reservas-deportivas.firebaseapp.com",
    projectId: "sistema-de-reservas-deportivas",
    storageBucket: "sistema-de-reservas-deportivas.firebasestorage.app",
    messagingSenderId: "867894075596",
    appId: "1:867894075596:web:e41499c12ced6b02556269"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


const bienvenidaUsuario =
    document.getElementById("bienvenidaUsuario");


// Mantener la sesión iniciada
setPersistence(auth, browserLocalPersistence)
    .then(() => {

        onAuthStateChanged(
            auth,
            async function(usuario) {

                console.log("Usuario detectado:", usuario);

                if (!usuario) {

                    console.log("No hay usuario autenticado.");

                    window.location.href = "index.html";

                    return;
                }


                try {

                    const referencia =
                        doc(
                            db,
                            "usuarios",
                            usuario.uid
                        );


                    const documento =
                        await getDoc(referencia);


                    if (!documento.exists()) {

                        console.log(
                            "No existe el usuario en Firestore."
                        );

                        window.location.href = "index.html";

                        return;
                    }


                    const datos =
                        documento.data();


                    console.log(
                        "Datos del usuario:",
                        datos
                    );


                    if (datos.rol !== "usuario") {

                        console.log(
                            "El usuario no tiene rol usuario."
                        );

                        window.location.href = "index.html";

                        return;
                    }


                    if (bienvenidaUsuario) {

                        bienvenidaUsuario.textContent =
                            "Bienvenido, " +
                            datos.nombre +
                            " 👋";

                    }

                } catch (error) {

                    console.error(
                        "Error al verificar usuario:",
                        error
                    );

                    alert(
                        "Ocurrió un error al verificar tu cuenta."
                    );

                }

            }
        );

    })
    .catch(function(error) {

        console.error(
            "Error al mantener la sesión:",
            error
        );

    });


// Cerrar sesión
const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

            }

        }
    );

}