import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

const baseUrlPrueba = AppSettings.API_ENDPOINT + '/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  registrar(data: Usuario): Observable<any> {
    return this.http.post(baseUrlPrueba + "/registrar", data);
  }

  registrarJefe(data: Usuario): Observable<any> {
    return this.http.post(baseUrlPrueba + "/registrarJefe", data);
  }

  registrarPrestamista(data: Usuario): Observable<any> {
    return this.http.post(baseUrlPrueba + "/registrarPrestamista", data);
  }

  registrarPrestatario(data: Usuario): Observable<any> {
    return this.http.post(baseUrlPrueba + "/registrarPrestatario", data);
  }

  actualizarUsuario(data: Usuario): Observable<any> {
    return this.http.put(baseUrlPrueba + "/actualizaUsuario", data);
  }

  listaUsuariosDeUnUsuario(idUsuario: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${baseUrlPrueba}/listaUsuariosDeUnUsuario/${idUsuario}`);
  }




}
