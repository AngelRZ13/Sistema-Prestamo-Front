import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUsuario } from './login-usuario';
import { Observable } from 'rxjs';
import { JwtDTO } from './jwt-dto';
import { AppSettings } from '../app.settings';

const authURL = AppSettings.API_ENDPOINT+ '/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(authURL + '/login', loginUsuario);
  }

  public getCurrentUser(): Observable<any> {
    return this.httpClient.get<any>(authURL + '/currentUser');
  }


}
