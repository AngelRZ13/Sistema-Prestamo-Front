import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Montos } from '../models/montos.model';
import { Observable } from 'rxjs';
import { Solicitud } from '../models/solicitud.model';

const baseUrlPrueba = AppSettings.API_ENDPOINT + '/solicitud';


@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private http: HttpClient) { }

  listaMontos():Observable<Montos[]>{
    return this.http.get<Montos[]>(baseUrlPrueba+"/listaMontos");
  }

  registrar(data: Solicitud): Observable<any> {
    return this.http.post(baseUrlPrueba + "/registraSolicitud", data);
  }

  consultaCompleja(nombre: string, fechaInicio?: Date, fechaFin?: Date): Observable<Solicitud[]> {
    let params = new HttpParams();

    if (nombre) {
      params = params.set('nombre', nombre);
    }

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio.toISOString().split('T')[0]); // Convert to yyyy-MM-dd format
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin.toISOString().split('T')[0]); // Convert to yyyy-MM-dd format
    }

    return this.http.get<Solicitud[]>(`${baseUrlPrueba}/consultaCompleja`, { params });
  }
  actualizarEstado(idSolicitud: number, nuevoEstadoId: number): Observable<any> {
    // Enviamos una solicitud PUT al backend con el nuevo estado
    return this.http.put(`${baseUrlPrueba}/${idSolicitud}/estado/${nuevoEstadoId}`, {});
  }

}
