import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCrYydAhPpwHWIrdrTiG13sFfvfFc1d1oc",
    authDomain: "sistema-de-reservas-deportivas.firebaseapp.com",
    projectId: "sistema-de-reservas-deportivas",
    storageBucket: "sistema-de-reservas-deportivas.firebasestorage.app",
    messagingSenderId: "867894075596",
    appId: "1:867894075596:web:e41499c12ced6b02556269"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


const formReserva =
    document.getElementById("formReserva");

const mensajeReserva =
    document.getElementById("mensajeReserva");


onAuthStateChanged(
    auth,
    function(usuario) {

        if (!usuario) {

            window.location.href =
                "index.html";

            return;
        }

        console.log(
            "Usuario autorizado:",
            usuario.email
        );

    }
);


const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            await signOut(auth);

            window.location.href =
                "index.html";

        }
    );

}


formReserva.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const usuario = auth.currentUser;


        if (!usuario) {

            mensajeReserva.textContent =
                "❌ Debes iniciar sesión para realizar una reserva.";

            mensajeReserva.style.color =
                "red";

            return;
        }


        const cancha =
            document.getElementById("cancha").value;

        const fecha =
            document.getElementById("fecha").value;

        const horario =
            document.getElementById("horario").value;


        try {

            await addDoc(
                collection(db, "reservas"),
                {
                    usuarioId: usuario.uid,
                    correoUsuario: usuario.email,
                    cancha: cancha,
                    fecha: fecha,
                    horario: horario,
                    estado: "confirmada",
                    creadoEn: serverTimestamp()
                }
            );


            mensajeReserva.textContent =
                "✅ ¡Reserva confirmada correctamente!";

            mensajeReserva.style.color =
                "green";


            formReserva.reset();


        } catch (error) {

            console.error(
                "Error al guardar la reserva:",
                error
            );


            mensajeReserva.textContent =
                "❌ No se pudo guardar la reserva.";

            mensajeReserva.style.color =
                "red";

        }

    }
);