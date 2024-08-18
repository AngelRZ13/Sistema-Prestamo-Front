import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Solicitud } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-listado-solicitud-estado',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './listado-solicitud-estado.component.html',
  styleUrl: './listado-solicitud-estado.component.css'
})
export class ListadoSolicitudEstadoComponent {

  constructor(
    public dialogRef: MatDialogRef<ListadoSolicitudEstadoComponent>,
    @Inject(MAT_DIALOG_DATA) public obj: any,
    private solicitudService: SolicitudService
  ){}

  aprobar() {
    this.solicitudService.actualizarEstado(this.obj.idSolicitud, 2) // 2 para aprobado
      .subscribe(() => {
        this.dialogRef.close(); // Cierra el diálogo después de la actualización
      });
  }

  rechazar() {
    this.solicitudService.actualizarEstado(this.obj.idSolicitud, 3) // 3 para rechazado
      .subscribe(() => {
        this.dialogRef.close(); // Cierra el diálogo después de la actualización
      });
  }


}
