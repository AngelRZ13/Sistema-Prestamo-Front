import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UsuarioService } from '../../services/usuario.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { MenuComponent } from "../../menu/menu.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SolicitudService } from '../../services/solicitud.service';
import { Montos } from '../../models/montos.model';
import { MatTableDataSource } from '@angular/material/table';
import { AgregarSolicitudRegistroComponent } from '../agregar-solicitud-registro/agregar-solicitud-registro.component';
import { DataSharingService } from '../../services/data-sharing.service';


@Component({
  selector: 'app-agregar-solicitud',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MenuComponent],
  templateUrl: './agregar-solicitud.component.html',
  styleUrl: './agregar-solicitud.component.css'
})
export class AgregarSolicitudComponent implements OnInit {
  displayedColumns: string[] = ['duracion', 's150', 's200', 's300', 's400', 's500'];
  dataSource = new MatTableDataSource<Montos>([]);
  durations: number[] = [];
  capitals: number[] = [150, 200, 300, 400, 500];
  selectedMonto: { [key: number]: { [key: number]: boolean } } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private solicitudService: SolicitudService,
    private dataSharingService: DataSharingService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.solicitudService.listaMontos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.durations = Array.from(new Set(data.map(item => item.dias).filter((dias): dias is number => dias !== undefined))).sort((a, b) => (a! - b!));
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al obtener montos', err);
      }
    });
  }

  getMonto(capital: number, dias: number): number | undefined {
    return this.dataSource.data.find(item => item.capital === capital && item.dias === dias)?.monto;
  }

  selectMonto(capital: number, dias: number) {
    const monto = this.getMonto(capital, dias);
    if (monto !== undefined) {
      this.dataSharingService.changeMonto(monto);
      this.openDialogRegistra();
    }
  }

  openDialogRegistra() {
    this.dialog.open(AgregarSolicitudRegistroComponent, {
      width: '600px'
    });
  }
}
