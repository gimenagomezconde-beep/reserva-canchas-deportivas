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
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


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

setPersistence(auth, browserLocalPersistence);


// Elementos
const tablaUsuarios = document.getElementById("tablaUsuarios");

const mensajeUsuarios = document.getElementById("mensajeUsuarios");

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

const buscarUsuario = document.getElementById("buscarUsuario");

const formularioEditar = document.getElementById("formularioEditar");

const editarNombre = document.getElementById("editarNombre");

const editarTelefono = document.getElementById("editarTelefono");

const editarRol = document.getElementById("editarRol");

const btnGuardarCambios = document.getElementById("btnGuardarCambios");

const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");


let usuarios = [];

let usuarioEditando = null;


// Verificar sesión
onAuthStateChanged(auth, async function(usuario) {

    if (!usuario) {

        window.location.href = "index.html";

        return;
    }

    console.log("Administrador conectado:", usuario.email);

    await cargarUsuarios();

});


// Cargar usuarios
async function cargarUsuarios() {

    try {

        const resultado = await getDocs(
            collection(db, "usuarios")
        );


        if (resultado.empty) {

            mensajeUsuarios.textContent =
                "No existen usuarios registrados.";

            return;
        }


        mensajeUsuarios.textContent =
            "Usuarios encontrados: " + resultado.size;


        usuarios = [];


        resultado.forEach(function(documento) {

            usuarios.push({

                id: documento.id,

                ...documento.data()

            });

        });


        mostrarUsuarios(usuarios);


    } catch (error) {

        console.error(
            "ERROR AL CARGAR USUARIOS:",
            error
        );

        mensajeUsuarios.textContent =
            "❌ Error al cargar los usuarios.";

    }

}


// Mostrar usuarios
function mostrarUsuarios(lista) {

    tablaUsuarios.innerHTML = "";


    lista.forEach(function(usuario) {

        const fila = document.createElement("tr");


        fila.innerHTML = `
            <td>${usuario.nombre || "-"}</td>

            <td>${usuario.correo || "-"}</td>

            <td>${usuario.telefono || "-"}</td>

            <td>${usuario.rol || "-"}</td>

            <td>
                <button class="btn-editar">
                    ✏️ Editar
                </button>
                <button class="btn-eliminar">
                    🗑️ eliminar
                </button>
            </td>
        `;


        const botonEditar =
            fila.querySelector(".btn-editar");


        botonEditar.addEventListener(
            "click",
            function() {

                editarUsuario(usuario);

            }
        );
        const botonEliminar =
    fila.querySelector(".btn-eliminar");


botonEliminar.addEventListener(
    "click",
    function() {

        eliminarUsuario(usuario);

    }
);


        tablaUsuarios.appendChild(fila);

    });

}


// Abrir formulario de edición
function editarUsuario(usuario) {

    usuarioEditando = usuario;


    editarNombre.value =
        usuario.nombre || "";


    editarTelefono.value =
        usuario.telefono || "";


    editarRol.value =
        usuario.rol || "usuario";


    formularioEditar.style.display = "block";


    formularioEditar.scrollIntoView({
        behavior: "smooth"
    });

}
async function eliminarUsuario(usuario) {

    const confirmar = confirm(
        "¿Está seguro de eliminar al usuario " +
        usuario.nombre +
        "?"
    );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "usuarios",
                usuario.id
            )
        );


        alert(
            "✅ Usuario eliminado correctamente."
        );


        await cargarUsuarios();


    } catch (error) {

        console.error(
            "ERROR AL ELIMINAR USUARIO:",
            error
        );


        alert(
            "❌ No se pudo eliminar el usuario."
        );

    }

}

// Guardar cambios
btnGuardarCambios.addEventListener(
    "click",
    async function() {

        if (!usuarioEditando) {

            return;
        }


        const nuevoNombre =
            editarNombre.value.trim();


        const nuevoTelefono =
            editarTelefono.value.trim();


        const nuevoRol =
            editarRol.value;


        if (!nuevoNombre) {

            alert("Ingrese el nombre del usuario.");

            return;
        }


        try {

            await updateDoc(
                doc(
                    db,
                    "usuarios",
                    usuarioEditando.id
                ),
                {
                    nombre: nuevoNombre,
                    telefono: nuevoTelefono,
                    rol: nuevoRol
                }
            );


            alert("✅ Usuario actualizado correctamente.");


            formularioEditar.style.display =
                "none";


            usuarioEditando = null;


            await cargarUsuarios();


        } catch (error) {

            console.error(
                "ERROR AL ACTUALIZAR USUARIO:",
                error
            );

            alert(
                "❌ No se pudo actualizar el usuario."
            );

        }

    }
);


// Cancelar edición
btnCancelarEdicion.addEventListener(
    "click",
    function() {

        formularioEditar.style.display =
            "none";

        usuarioEditando = null;

    }
);


// Buscar usuarios
buscarUsuario.addEventListener(
    "input",
    function() {

        const texto =
            buscarUsuario.value
            .toLowerCase()
            .trim();


        const resultados =
            usuarios.filter(
                function(usuario) {

                    const nombre =
                        (usuario.nombre || "")
                        .toLowerCase();


                    const correo =
                        (usuario.correo || "")
                        .toLowerCase();


                    return nombre.includes(texto) ||
                           correo.includes(texto);

                }
            );


        mostrarUsuarios(resultados);

    }
);


// Cerrar sesión
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