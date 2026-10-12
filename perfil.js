import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


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

const db = getFirestore(app);

const auth = getAuth(app);


// ==========================================
// CARGAR PERFIL DEL USUARIO
// ==========================================

onAuthStateChanged(auth, async (usuario) => {

    // Comprobar si hay un usuario conectado
    if (!usuario) {

        document.getElementById("nombrePerfil").textContent =
            "No hay una sesión iniciada";

        document.getElementById("correoPerfil").textContent =
            "-";

        document.getElementById("telefonoPerfil").textContent =
            "-";

        document.getElementById("tipoPerfil").textContent =
            "-";

        document.getElementById("fechaPerfil").textContent =
            "-";

        return;
    }


    try {

        // UID del usuario que inició sesión
        const uid = usuario.uid;

        console.log("UID del usuario:", uid);


        // Buscar solamente su documento
        const referenciaUsuario = doc(
            db,
            "usuarios",
            uid
        );


        const documentoUsuario =
            await getDoc(referenciaUsuario);


        // Comprobar si existe
        if (!documentoUsuario.exists()) {

            document.getElementById("nombrePerfil").textContent =
                "Usuario no encontrado";

            document.getElementById("correoPerfil").textContent =
                usuario.email || "-";

            document.getElementById("telefonoPerfil").textContent =
                "-";

            document.getElementById("tipoPerfil").textContent =
                "Usuario";

            document.getElementById("fechaPerfil").textContent =
                "-";

            return;
        }


        // Obtener los datos de Firestore
        const datos = documentoUsuario.data();


        // ==========================================
        // NOMBRE
        // ==========================================

        document.getElementById("nombrePerfil").textContent =
            datos.nombreCompleto ||
            datos.nombre ||
            `${datos.nombres || ""} ${datos.apellidos || ""}`.trim() ||
            "-";


        // ==========================================
        // CORREO
        // ==========================================

        document.getElementById("correoPerfil").textContent =
            datos.correo ||
            datos.email ||
            usuario.email ||
            "-";


        // ==========================================
        // TELÉFONO
        // ==========================================

        document.getElementById("telefonoPerfil").textContent =
            datos.telefono ||
            "-";


        // ==========================================
        // TIPO DE USUARIO
        // ==========================================

        document.getElementById("tipoPerfil").textContent =
            datos.rol ||
            datos.tipoUsuario ||
            "Usuario";


        // ==========================================
        // FECHA DE REGISTRO
        // ==========================================

        let fecha = datos.creadoEn;

        if (fecha && typeof fecha.toDate === "function") {

            fecha = fecha.toDate();

        }


        if (fecha instanceof Date) {

            document.getElementById("fechaPerfil").textContent =
                fecha.toLocaleDateString("es-PE");

        } else {

            document.getElementById("fechaPerfil").textContent =
                fecha || "-";

        }


    } catch (error) {

        console.error(
            "Error al cargar el perfil:",
            error
        );


        document.getElementById("nombrePerfil").textContent =
            "Error al cargar los datos";

        document.getElementById("correoPerfil").textContent =
            "-";

        document.getElementById("telefonoPerfil").textContent =
            "-";

        document.getElementById("tipoPerfil").textContent =
            "Usuario";

        document.getElementById("fechaPerfil").textContent =
            "-";
    }

});