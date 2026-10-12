import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
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

setPersistence(
    auth,
    browserLocalPersistence
);

const db = getFirestore(app);


// ==========================================
// REGISTRO DE USUARIO
// ==========================================

const formRegistro =
    document.getElementById("formRegistro");


if (formRegistro) {

    formRegistro.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const nombre =
                document.getElementById("nombre")
                .value
                .trim();

            const correo =
                document.getElementById("correoRegistro")
                .value
                .trim();

            const telefono =
                document.getElementById("telefono")
                .value
                .trim();

            const password =
                document.getElementById("passwordRegistro")
                .value;

            const confirmarPassword =
                document.getElementById("confirmarPassword")
                .value;

            const mensaje =
                document.getElementById("mensajeRegistro");


            // Comprobar contraseñas

            if (password !== confirmarPassword) {

                mensaje.textContent =
                    "❌ Las contraseñas no coinciden.";

                mensaje.style.color = "red";

                return;
            }


            // Comprobar contraseña

            if (password.length < 6) {

                mensaje.textContent =
                    "❌ La contraseña debe tener mínimo 6 caracteres.";

                mensaje.style.color = "red";

                return;
            }


            try {

                // Crear usuario

                const resultado =
                    await createUserWithEmailAndPassword(
                        auth,
                        correo,
                        password
                    );

                const usuario =
                    resultado.user;


                console.log(
                    "Usuario creado:",
                    usuario.uid
                );


                // Guardar información en Firestore

                await setDoc(
                    doc(
                        db,
                        "usuarios",
                        usuario.uid
                    ),
                    {

                        nombre: nombre,

                        correo: correo,

                        telefono: telefono,

                        rol: "usuario",

                        creadoEn: new Date()

                    }
                );


                mensaje.textContent =
                    "✅ Cuenta creada correctamente.";

                mensaje.style.color = "green";


                formRegistro.reset();


                setTimeout(
                    function() {

                        window.location.href =
                            "index.html";

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Error al registrar:",
                    error
                );


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    mensaje.textContent =
                        "❌ Este correo ya está registrado.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    mensaje.textContent =
                        "❌ El correo electrónico no es válido.";

                }

                else {

                    mensaje.textContent =
                        "❌ No se pudo crear la cuenta.";

                }


                mensaje.style.color = "red";

            }

        }
    );

}


// ==========================================
// INICIO DE SESIÓN
// ==========================================

const formLogin =
    document.getElementById("formLogin");


if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const correo =
                document.getElementById("correo")
                .value
                .trim();


            const password =
                document.getElementById("password")
                .value;


            const mensaje =
                document.getElementById("mensajeLogin");


            try {

                console.log(
                    "Intentando iniciar sesión..."
                );


                // Iniciar sesión

                const resultado =
                    await signInWithEmailAndPassword(
                        auth,
                        correo,
                        password
                    );


                const usuario =
                    resultado.user;


                console.log(
                    "Sesión iniciada correctamente."
                );

                console.log(
                    "Correo:",
                    usuario.email
                );

                console.log(
                    "UID:",
                    usuario.uid
                );


                // Buscar perfil

                const referencia =
                    doc(
                        db,
                        "usuarios",
                        usuario.uid
                    );


                const documento =
                    await getDoc(referencia);


                if (!documento.exists()) {

                    mensaje.textContent =
                        "❌ No se encontró el perfil del usuario.";

                    mensaje.style.color = "red";

                    return;
                }


                const datos =
                    documento.data();


                console.log(
                    "Rol:",
                    datos.rol
                );


                // ==========================================
                // REDIRECCIÓN SEGÚN EL ROL
                // ==========================================

                if (
                    datos.rol ===
                    "administrador"
                ) {

                    window.location.href =
                        "administrador.html";

                }

                else {

                    window.location.href =
                        "usuario.html";

                }

            } catch (error) {

                console.error(
                    "Error al iniciar sesión:",
                    error
                );


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    mensaje.textContent =
                        "❌ Correo o contraseña incorrectos.";

                }

                else if (
                    error.code ===
                    "auth/api-key-not-valid"
                ) {

                    mensaje.textContent =
                        "❌ La API Key de Firebase no es válida.";

                }

                else {

                    mensaje.textContent =
                        "❌ No se pudo iniciar sesión.";

                }


                mensaje.style.color = "red";

            }

        }
    );

}


// ==========================================
// COMPROBAR SESIÓN
// ==========================================

onAuthStateChanged(
    auth,
    function(usuario) {

        if (usuario) {

            console.log(
                "Usuario conectado:",
                usuario.email
            );

            console.log(
                "UID:",
                usuario.uid
            );

        }

        else {

            console.log(
                "No hay usuario conectado."
            );

        }

    }
);