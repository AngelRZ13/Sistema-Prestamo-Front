import { Estados } from "./estados.model";
import { Usuario } from "./usuario.model";

export class Solicitud {
  idSolicitud?: number;
  capital?: number;
  montoPagar?: number;
  fechaInicioPrestamo?: Date;
  fechaFinPrestamo?: Date;
  dias?: number;
  pagoDiario?: number;
  EstadoSolicitud?: Estados;
  usuarioRegistro?: number;
  usuarioActualizacion?: number;
  usuarioPrestatario?: number;
  Interes?: String;
}
