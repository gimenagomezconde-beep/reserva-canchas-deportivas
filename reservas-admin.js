import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==========================================
// CONFIGURACIÓN DE FIREBASE
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDuGP9bNWlLejROBDqnmFl4mo9BAKrpQCU",

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

const db = getFirestore(app);


// ==========================================
// MANTENER SESIÓN
// ==========================================

setPersistence(
    auth,
    browserLocalPersistence
);


// ==========================================
// ELEMENTOS HTML
// ==========================================

const tablaReservas =
    document.getElementById("tablaReservas");

const mensajeReservas =
    document.getElementById("mensajeReservas");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


// ==========================================
// COMPROBAR USUARIO
// ==========================================

onAuthStateChanged(
    auth,
    async function(usuario) {

        console.log(
            "Usuario detectado:",
            usuario
        );


        if (!usuario) {

            mensajeReservas.textContent =
                "❌ No hay una sesión activa.";

            console.log(
                "Firebase no detectó ningún usuario."
            );

            return;
        }


        console.log(
            "Usuario autenticado:",
            usuario.email
        );

        console.log(
            "UID:",
            usuario.uid
        );


        // Cargar reservas

        await cargarReservas();

    }
);


// ==========================================
// CARGAR RESERVAS
// ==========================================

async function cargarReservas() {

    try {

        console.log(
            "Intentando cargar colección reservas..."
        );


        const resultado =
            await getDocs(
                collection(
                    db,
                    "reservas"
                )
            );


        console.log(
            "Cantidad de reservas:",
            resultado.size
        );


        tablaReservas.innerHTML = "";


        // ==========================================
        // NO HAY RESERVAS
        // ==========================================

        if (resultado.empty) {

            mensajeReservas.textContent =
                "No existen reservas registradas.";

            return;
        }


        mensajeReservas.textContent =
            "Reservas encontradas: " +
            resultado.size;


        // ==========================================
        // MOSTRAR RESERVAS
        // ==========================================

        resultado.forEach(
            function(documento) {

                const reserva =
                    documento.data();


                console.log(
                    "Reserva:",
                    reserva
                );


                const fila =
                    document.createElement("tr");


                fila.innerHTML = `

                    <td>
                        ${reserva.correoUsuario || "-"}
                    </td>

                    <td>
                        ${reserva.cancha || "-"}
                    </td>

                    <td>
                        ${reserva.fecha || "-"}
                    </td>

                    <td>
                        ${reserva.horario || "-"}
                    </td>

                    <td>
                        ${reserva.estado || "-"}
                    </td>

                `;


                tablaReservas.appendChild(
                    fila
                );

            }
        );


    } catch (error) {

        console.error(
            "ERROR AL CARGAR RESERVAS:",
            error
        );


        mensajeReservas.textContent =
            "❌ Error al cargar las reservas.";

    }

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function() {

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