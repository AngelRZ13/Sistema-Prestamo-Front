import { Component, OnInit, signal } from '@angular/core';
import { AppMaterialModule } from '../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '../security/token.service';
import { AuthService } from '../security/auth.service';
import Swal from 'sweetalert2';
import { LoginUsuario } from '../security/login-usuario';
import { AgregarUsuarioComponent } from '../components/agregar-usuario/agregar-usuario.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink,AppMaterialModule, FormsModule, CommonModule , MenuComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  hide = signal(true);
  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario = {};
  roles: string[] = [];
  errMsj!: string;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    console.log("constructor >> constructor >>> " + this.tokenService.getToken());
  }

  ngOnInit() {
    if (this.tokenService.getToken()) {
        this.isLogged = true;
        this.isLoginFail = false;
        this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void {
    this.authService.login(this.loginUsuario).subscribe(
      (data: any) => {
        this.isLogged = true;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.login);
        this.tokenService.setUserNameComplete(data.nombreCompleto);
        this.tokenService.setAuthorities(data.authorities);
        this.tokenService.setUserId(data.idUsuario);
        this.tokenService.setOpciones(data.opciones);

        this.roles = data.authorities;
        this.router.navigate(['/']);

        console.log("onLogin() >> token >>> " +  this.tokenService.getToken());
        console.log("onLogin() >> setUserName >>> " +  this.tokenService.getUserName());
        console.log("onLogin() >> setUserNameComplete >>> " +  this.tokenService.getUserNameComplete());
        console.log("onLogin() >> idUsuario >>> " +  this.tokenService.getUserId());
        console.log("onLogin() >> roles >>> " +  this.tokenService.getAuthorities());
        console.log("onLogin() >> opciones >>> INICIO >> " );
        this.tokenService.getOpciones().forEach(obj => {
          console.log(" >> onLogin() >> " +  obj.nombre );
        });
        console.log("onLogin() >> opciones >>> FIN >> " );
      },
      (err: any) => {
        this.isLogged = false;
        this.errMsj = err.message;
        console.log(err);
        if (err.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Usuario no Autorizado",
          });
        }
      }
    );
  }

  openDialogRegistra(event: Event): void {
    event.preventDefault(); // Prevenir el envío del formulario
    const dialogRef = this.dialog.open(AgregarUsuarioComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
  clickEvent(event: MouseEvent) {
    event.preventDefault(); // Prevenir el envío del formulario
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
