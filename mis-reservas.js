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
    query,
    where,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==========================================
// CONFIGURACIÓN DE FIREBASE
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyCrYydAhPpwHWIrdrTiG13sFfvfFc1d1oc",
    authDomain: "sistema-de-reservas-deportivas.firebaseapp.com",
    projectId: "sistema-de-reservas-deportivas",
    storageBucket: "sistema-de-reservas-deportivas.firebasestorage.app",
    messagingSenderId: "867894075596",
    appId: "1:867894075596:web:e41499c12ced6b02556269"
};


// ==========================================
// INICIAR FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


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
// CERRAR SESIÓN
// ==========================================

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            await signOut(auth);

            window.location.href = "index.html";

        }
    );

}


// ==========================================
// VERIFICAR USUARIO
// ==========================================

onAuthStateChanged(
    auth,
    async function(usuario) {
        console.log("Usuario detectado:", usuario);

        if (!usuario) {

            window.location.href =
                "index.html";

            return;
        }

        console.log(
            "Usuario conectado:",
            usuario.email
        );

        await cargarReservas(usuario.uid);

    }
);


// ==========================================
// CARGAR RESERVAS DEL USUARIO
// ==========================================
async function cargarReservas(uid) {

    try {

        const referenciaReservas =
            collection(db, "reservas");

        const consulta =
            query(
                referenciaReservas,
                where(
                    "usuarioId",
                    "==",
                    uid
                )
            );

        console.log("Consultando reservas...");

        const resultado =
            await getDocs(consulta);

        console.log(
            "Reservas encontradas:",
            resultado.size
        );

        tablaReservas.innerHTML = "";

        if (resultado.empty) {

            tablaReservas.innerHTML = `
                <tr>
                    <td colspan="5">
                        No tienes reservas registradas.
                    </td>
                </tr>
            `;

            return;
        }


        // ==================================
        // SI NO HAY RESERVAS
        // ==================================

        if (resultado.empty) {

            tablaReservas.innerHTML = `
                <tr>
                    <td colspan="5">
                        No tienes reservas registradas.
                    </td>
                </tr>
            `;

            return;
        }


        // ==================================
        // MOSTRAR RESERVAS
        // ==================================

        resultado.forEach(
            function(documento) {

                const reserva =
                    documento.data();

                const idReserva =
                    documento.id;


                const fila =
                    document.createElement("tr");


                let estadoHTML = "";

                let accionHTML = "";


                // --------------------------
                // RESERVA CONFIRMADA
                // --------------------------

                if (
                    reserva.estado ===
                    "confirmada"
                ) {

                    estadoHTML = `
                        <span class="estado-confirmada">
                            Confirmada
                        </span>
                    `;


                    accionHTML = `
                        <button
                            class="btn-cancelar"
                            data-id="${idReserva}">
                            Cancelar
                        </button>
                    `;

                }


                // --------------------------
                // RESERVA CANCELADA
                // --------------------------

                else {

                    estadoHTML = `
                        <span class="estado-cancelada">
                            Cancelada
                        </span>
                    `;

                    accionHTML = `
                        <span>
                            —
                        </span>
                    `;
                }


                fila.innerHTML = `

                    <td>
                        ${reserva.cancha}
                    </td>

                    <td>
                        ${reserva.fecha}
                    </td>

                    <td>
                        ${reserva.horario}
                    </td>

                    <td>
                        ${estadoHTML}
                    </td>

                    <td>
                        ${accionHTML}
                    </td>

                `;


                tablaReservas.appendChild(fila);

            }
        );


        // ==================================
        // BOTONES CANCELAR
        // ==================================

        const botonesCancelar =
            document.querySelectorAll(
                ".btn-cancelar"
            );


        botonesCancelar.forEach(
            function(boton) {

                boton.addEventListener(
                    "click",
                    async function() {

                        const idReserva =
                            boton.dataset.id;


                        const confirmar =
                            confirm(
                                "¿Estás seguro de cancelar esta reserva?"
                            );


                        if (!confirmar) {

                            return;

                        }


                        await cancelarReserva(
                            idReserva
                        );

                    }
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar reservas:",
            error
        );


        mensajeReservas.textContent =
            "❌ No se pudieron cargar tus reservas.";

        mensajeReservas.style.color =
            "red";

    }

}


// ==========================================
// CANCELAR RESERVA
// ==========================================

async function cancelarReserva(idReserva) {

    try {

        const referencia =
            doc(
                db,
                "reservas",
                idReserva
            );


        await updateDoc(
            referencia,
            {
                estado: "cancelada"
            }
        );


        mensajeReservas.textContent =
            "✅ La reserva fue cancelada correctamente.";

        mensajeReservas.style.color =
            "green";


        // Volver a cargar las reservas

        await cargarReservas(
            auth.currentUser.uid
        );


    } catch (error) {

        console.error(
            "Error al cancelar reserva:",
            error
        );


        mensajeReservas.textContent =
            "❌ No se pudo cancelar la reserva.";

        mensajeReservas.style.color =
            "red";

    }

}