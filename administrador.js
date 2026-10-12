import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


// ==========================================
// CONFIGURACIÓN DE FIREBASE
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyCrYydAhPpwHWIrdrTiG13sFfvfFc1d1oc",

    authDomain:
        "sistema-de-reservas-deportivas.firebaseapp.com",

    projectId:
        "sistema-de-reservas-deportivas",

    storageBucket:
        "sistema-de-reservas-deportivas.firebasestorage.app",

    messagingSenderId:
        "867894075596",

    appId:
        "1:867894075596:web:e41499c12ced6b02556269"

};


// ==========================================
// INICIALIZAR FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ==========================================
// COMPROBAR SESIÓN
// ==========================================

onAuthStateChanged(auth, function(usuario) {

    if (!usuario) {

        window.location.href = "index.html";

    }

});


// ==========================================
// CERRAR SESIÓN
// ==========================================

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function() {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            }

            catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

            }

        }
    );

}