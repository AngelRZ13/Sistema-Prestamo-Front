import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { TokenService } from '../../security/token.service';
import { SolicitudService } from '../../services/solicitud.service';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Solicitud } from '../../models/solicitud.model';
import { MatTableDataSource } from '@angular/material/table';
import { ListadoSolicitudEstadoComponent } from '../listado-solicitud-estado/listado-solicitud-estado.component';

@Component({
  selector: 'app-listado-solicitudes',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './listado-solicitudes.component.html',
  styleUrl: './listado-solicitudes.component.css'
})
export class ListadoSolicitudesComponent {
  searchForm!: FormGroup;

  dataSource : MatTableDataSource<Solicitud> = new MatTableDataSource<Solicitud>();

  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns = ["idSolicitud","nombre de Prestatario","Monto","Pago Diario","Interes","Acciones"];

  filtro: string = "";

  objUsuario: Usuario = {} ;


  constructor(private dialogService: MatDialog,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private solicitudService: SolicitudService,
    private fb: FormBuilder

  ){
this.objUsuario.idUsuario = tokenService.getUserId();
}
ngOnInit() {
  this.searchForm = this.fb.group({
    nombre: [null, Validators.required],
    fechaInicioPrestamo: [null, Validators.required],
    fechaFinPrestamo: [null, Validators.required]
  });
}

Consulta(): void {
  const formValues = this.searchForm.value;
  const nombre = formValues.nombre;
  const fechaInicioPrestamo = formValues.fechaInicioPrestamo ? new Date(formValues.fechaInicioPrestamo) : undefined;
  const fechaFinPrestamo = formValues.fechaFinPrestamo ? new Date(formValues.fechaFinPrestamo) : undefined;

  console.log('Nombre:', nombre);
  console.log('Fecha Inicio:', fechaInicioPrestamo);
  console.log('Fecha Fin:', fechaFinPrestamo);

  this.solicitudService.consultaCompleja(nombre, fechaInicioPrestamo, fechaFinPrestamo).subscribe({
    next: (data) => {
      console.log('Datos recibidos:', data);
      data.forEach((solicitud: Solicitud) => {
        solicitud.Interes = solicitud.pagoDiario ? (solicitud.pagoDiario * 0.10).toFixed(2) : '0.00'});
      this.dataSource.data = data;
    },
    error: (err) => {
      console.error('Error retrieving solicitudes', err);
    }
  });
}

openDialogActualizar(obj: Solicitud){
  console.log(">>> openDialogActualizar [ini]");
  console.log("obj: ", obj);
  const dialogRef = this.dialogService.open(ListadoSolicitudEstadoComponent, { data: obj });
  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed with result:', result);
  });
  console.log(">>> openDialogActualizar [fin]");
}
}
