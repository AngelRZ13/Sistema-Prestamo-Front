import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { AppMaterialModule } from '../../app.material.module';
import { UsuarioService } from '../../services/usuario.service';
import { UtilService } from '../../services/util.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-usuario-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './crud-usuario-actualizar.component.html',
  styleUrl: './crud-usuario-actualizar.component.css'
})
export class CrudUsuarioActualizarComponent {
  usuario: Usuario = {
    nombre: "",
    apellido: "",
    dni: 0,
    telefono: 0,
    usuario: "",
    contrasena: "",
    direccion: "",
    nombreCompleto: "",
    usuarioSuperior: -1,
    usuarioRegistro: 1,
    usuarioActualiza: 1
  }

  formRegistrar = this.formBuilder.group({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')]],
    validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')]],
    validaUsuario: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')]],
    validaContrasena: ['', [Validators.required]],
    validaDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    validaDireccion: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.,# ]{3,200}')]]
  });

  //usuario en sesion
  objUsuario: Usuario = {};

  constructor(private usuarioService: UsuarioService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Usuario) {
      this.usuario = data;

    console.log(">>> constructor  >>> ");
  }
  ngOnInit() {
    console.log(">>> OnInit [inicio]");
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log(">>> OnInit [fin]");
  }


  actualizar() {
    console.log(">>> registra [inicio]");
    this.usuario.usuarioActualiza = this.objUsuario.idUsuario ;
    this.usuario.usuarioRegistro = this.objUsuario.idUsuario ;
    this.usuario.usuarioSuperior = this.objUsuario.idUsuario ;


    console.log(">>> registra [inicio] " + this.usuario);
    console.log(">>> Nombres " + this.usuario.nombre);

    this.usuarioService.actualizarUsuario(this.usuario).subscribe(
      x => {
        Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
        this.usuario = {
          nombre: "",
          apellido: "",
          dni: 0,
          telefono: 0,
          usuario: "",
          contrasena: "",
          direccion: "",
          nombreCompleto: "",
          usuarioSuperior: -1,
          usuarioRegistro: 1,
          usuarioActualiza: 1
        }
      }
    );
  }
}
