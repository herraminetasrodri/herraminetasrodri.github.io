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
    collection("Alumno");
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
    forma.addEventListener(
      "submit", guarda);
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
    const precio = getInt(formData, "grupo").trim();
    const fecha = getString(formData, "precio").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      codigo,
      nombre,
      clasificacion,
      precio,
      fecha 
    };
    await daoHerramienta.
      add(modelo);
      muestraHerramienta();
  } catch (e) {
    muestraError(e);
  }
}

