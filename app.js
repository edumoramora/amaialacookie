
/* ============================================================
   COOKIELAB · app.js (SOLUCIONARIO)
   Práctica de cookies por fases · Unidad 3 · 2º DAW
   ------------------------------------------------------------
   Cada bloque lleva un comentario indicando a qué FASE de la
   práctica pertenece, para seguirlo paso a paso.
   ============================================================ */


/* ============================================================
   ANTES DE EMPEZAR · comprobación del proyecto base
   (el console.log de prueba: si se ve en la consola, todo va bien)
   ============================================================ */
console.log("CookieLab iniciado. ¡El proyecto funciona!");


/* ============================================================
   FUNCIONES DE COOKIES
   Se van construyendo a lo largo de la práctica (sobre todo en
   la FASE 2 "recordar al usuario"). Tenerlas aquí arriba hace
   que el resto de fases sea solo llamarlas.
   ============================================================ */

// Guardar / crear una cookie que dura 'dias' días
function guardarCookie(nombre, valor, dias) {
  const segundos = dias * 24 * 60 * 60;
  document.cookie = nombre + "=" + valor + "; max-age=" + segundos + "; path=/";
}

// Leer una cookie por su nombre (devuelve null si no existe)
function leerCookie(nombre) {
  const trozos = document.cookie.split("; ");
  for (const trozo of trozos) {
    if (trozo.startsWith(nombre + "=")) return trozo.split("=")[1];
  }
  return null;
}

// Borrar una cookie (la hacemos caducar con max-age=0)
function borrarCookie(nombre) {
  document.cookie = nombre + "=; max-age=0; path=/";
}


/* ============================================================
   FASE 1 · Pedir y guardar el nombre
   Versión mínima (se amplía en la Fase 2 con el guard):
     let nombre = prompt("¿Cómo te llamas?");
     guardarCookie("usuario", nombre, 30);
     alert("¡Bienvenido, " + nombre + "!");
   ============================================================ */


/* ============================================================
   FASE 2 · Recordar al usuario (el GUARD)
   Distinguimos la primera visita de las siguientes.
   ============================================================ */
function identificarUsuario() {
  let usuario = leerCookie("usuario");

  if (!usuario) {
    // No hay cookie -> primera visita (esto es lo de la FASE 1)
    usuario = prompt("¡Hola! ¿Cómo te llamas?");
    if (!usuario) usuario = "invitado";
    guardarCookie("usuario", usuario, 30);
    alert("¡Bienvenido por primera vez, " + usuario + "!");
  }
  // Si ya existía, no preguntamos: solo saludamos
  mostrarSaludo(usuario);
}

function mostrarSaludo(usuario) {
  // El idioma se lee de la cookie (se configura en la FASE 3)
  const idioma = leerCookie("idioma") || "es";
  const texto = idioma === "en" ? "Hello again, " : "Hola de nuevo, ";
  document.getElementById("saludo").textContent = texto + usuario;
}


/* ============================================================
   FASE 3 · Preferencias (tema e idioma)
   Guardamos las elecciones y las aplicamos al volver.
   ============================================================ */
function aplicarTema() {
  const tema = leerCookie("tema") || "oscuro";
  document.body.classList.toggle("tema-claro", tema === "claro");
  document.getElementById("selTema").value = tema;
  document.getElementById("selIdioma").value = leerCookie("idioma") || "es";
}


/* ============================================================
   FASE 4 · Contador de visitas
   Sumamos 1 cada vez que se carga la página.
   ============================================================ */
function contarVisita() {
  let visitas = leerCookie("visitas");
  visitas = visitas ? Number(visitas) + 1 : 1; // Number: si no, concatenaría
  guardarCookie("visitas", visitas, 30);
  document.getElementById("visitas").textContent =
    "Has visitado esta página " + visitas + " veces.";
}


/* ============================================================
   FASE 5 · Panel de control
   Botones para cambiar el nombre y borrar todos los datos.
   ============================================================ */
function iniciarPanel() {
  // Cambiar tema (FASE 3) -> guarda la cookie y reaplica
  document.getElementById("selTema").addEventListener("change", function () {
    guardarCookie("tema", this.value, 30);
    aplicarTema();
  });

  // Cambiar idioma (FASE 3) -> guarda y vuelve a saludar
  document.getElementById("selIdioma").addEventListener("change", function () {
    guardarCookie("idioma", this.value, 30);
    mostrarSaludo(leerCookie("usuario") || "invitado");
  });

  // Cambiar nombre (FASE 5)
  document.getElementById("btnCambiarNombre").addEventListener("click", function () {
    const nuevo = prompt("¿Cuál es tu nombre?");
    if (nuevo) {
      guardarCookie("usuario", nuevo, 30);
      mostrarSaludo(nuevo);
    }
  });

  // Olvidar todo (FASE 5) -> confirm + borrar todas las cookies
  document.getElementById("btnOlvidar").addEventListener("click", function () {
    const seguro = confirm("¿Seguro que quieres borrar todos tus datos?");
    if (seguro) {
      borrarCookie("usuario");
      borrarCookie("tema");
      borrarCookie("idioma");
      borrarCookie("visitas");
      alert("Datos borrados. Recarga la página para empezar de cero.");
    }
  });
}


/* ============================================================
   ARRANQUE · se ejecuta al cargar la página
   Llama en orden a lo construido en cada fase.
   ============================================================ */
function iniciar() {
  aplicarTema();        // FASE 3
  identificarUsuario(); // FASE 1 y 2
  contarVisita();       // FASE 4
  iniciarPanel();       // FASE 5 (y controles de la 3)
}
document.addEventListener("DOMContentLoaded", iniciar);