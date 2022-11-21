import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraHerramienta
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoHerramienta =
  getFirestore().
    collection("Herramienta");
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc =
      await daoHerramienta.
        doc(id).
        get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Herramienta} */
      const data = doc.data();
      forma.codigo.value = data.codigo;
      forma.nombre.value = data.nombre || "";
      forma.clasificacion.value = data.clasificacion || "";
      forma.precio.value = data.precio || "";
      forma.fecha.value = data.fecha || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraHerramienta();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const codigo = getString(
        formData, "codigo").trim();  
    const nombre = getString(formData, "nombre").trim();
    const clasificacion = getString(formData, "clasificacion").trim();
    const precio = getInt(formData, "precio").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").
                Herramienta} */
    const modelo = {
      codigo, 
      nombre,
      clasificacion,
      precio,
      fecha
    };
    await daoHerramienta.
      doc(id).
      set(modelo);
    muestraHerramienta();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoHerramienta.
        doc(id).
        delete();
      muestraHerramienta();
    }
  } catch (e) {
    muestraError(e);
  }
}

