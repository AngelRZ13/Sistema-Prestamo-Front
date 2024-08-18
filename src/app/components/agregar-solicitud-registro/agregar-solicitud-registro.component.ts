import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
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
import { Solicitud } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataSharingService } from '../../services/data-sharing.service';
import moment from 'moment';


@Component({
  selector: 'app-agregar-solicitud-registro',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './agregar-solicitud-registro.component.html',
  styleUrl: './agregar-solicitud-registro.component.css'
})
export class AgregarSolicitudRegistroComponent {
  solicitud: Solicitud = {
    capital: 0,
    montoPagar: 0,
    fechaInicioPrestamo: new Date(),
    fechaFinPrestamo: new Date(),
    dias: 0,
    pagoDiario: 0,
    EstadoSolicitud: {
      idEstados: 1
    },
    usuarioRegistro:
         1
      ,
      usuarioActualizacion:
         1
      ,
      usuarioPrestatario:
         -1
  };

  formRegistrar = this.formBuilder.group({
    validaMontoPagar: ['', [Validators.required]],
    validaFechaInicioPrestamo: ['', [Validators.required]],
    validaFechaFinPrestamo: ['', [Validators.required]],
    validaDias: ['', [Validators.required]],
    validaPagoDiario: ['', [Validators.required]],
    idUsuarioPrestatario: ['', [Validators.required]] // Nuevo campo
  });

  private diasFestivos: string[] = [
    '2024-01-01',
    '2024-12-25',
    '2024-07-04',
    // Añadir otros días festivos aquí
  ];

  // Valores de capital posibles
  private valoresCapital = [150, 200, 300, 400, 500];

  constructor(
    private solicitudService: SolicitudService,
    private dataSharingService: DataSharingService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    @Inject(MAT_DIALOG_DATA) public data: Solicitud
  ) {}

  ngOnInit() {
    this.dataSharingService.selectedMonto.subscribe(monto => {
      this.solicitud.montoPagar = monto;
      this.formRegistrar.get('validaMontoPagar')?.setValue(monto.toString());
      this.actualizarCapital(monto);  // Actualizar el capital basado en el monto
    });

    this.formRegistrar.get('validaMontoPagar')?.valueChanges.subscribe(value => {
      if (value) {
        const monto = Number(value);
        this.actualizarFechaFinPrestamo();
        this.actualizarCapital(monto);  // Actualizar el capital basado en el monto
      }
    });

    this.formRegistrar.get('validaFechaInicioPrestamo')?.valueChanges.subscribe(() => {
      this.actualizarFechaFinPrestamo();
    });

    // Asignar idUsuarioPrestatario con el ID del usuario actual
    this.formRegistrar.get('idUsuarioPrestatario')?.setValue(this.tokenService.getUserId());
  }

  actualizarFechaFinPrestamo(): void {
    const monto = Number(this.formRegistrar.get('validaMontoPagar')?.value);
    const fechaInicio = this.formRegistrar.get('validaFechaInicioPrestamo')?.value;

    if (monto && fechaInicio) {
      const dias = this.obtenerDiasPorMonto(monto);
      const fechaInicioMoment = moment(fechaInicio);
      const fechaFinMoment = fechaInicioMoment.clone().add(dias, 'days');

      // Actualiza el campo de fecha de fin de préstamo
      this.formRegistrar.get('validaFechaFinPrestamo')?.setValue(fechaFinMoment.format('YYYY-MM-DD'));
      this.formRegistrar.get('validaDias')?.setValue(dias.toString());

      // Calcula los días hábiles y el pago diario
      const diasHabiles = this.calcularDiasHabiles(fechaInicioMoment, fechaFinMoment);
      this.calcularPagoDiario(monto, diasHabiles);
    }
  }

  obtenerDiasPorMonto(monto: number): number {
    if ([154.11, 205.49, 308.23, 410.98, 513.72].includes(monto)) {
      return 15;
    } else if ([155.49, 207.32, 310.98, 414.64, 518.30].includes(monto)) {
      return 20;
    } else if ([156.86, 209.15, 313.72, 418.30, 522.88].includes(monto)) {
      return 25;
    } else if ([157.23, 210.98, 316.47, 421.96, 527.45].includes(monto)) {
      return 30;
    } else if ([159.61, 212.81, 319.22, 425.62, 532.03].includes(monto)) {
      return 35;
    } else {
      return 0; // Valor por defecto si el monto no coincide con ninguno de los valores esperados
    }
  }

  calcularDiasHabiles(fechaInicio: moment.Moment, fechaFin: moment.Moment): number {
    let diasHabiles = -1;
    let fechaActual = fechaInicio.clone().add(1, 'day'); // Empezar a contar desde el día siguiente

    while (fechaActual.isBefore(fechaFin) || fechaActual.isSame(fechaFin, 'day')) {
      if (this.esDiaHabil(fechaActual)) {
        diasHabiles++;
      }
      fechaActual.add(1, 'day');
    }

    return diasHabiles;
  }

  esDiaHabil(fecha: moment.Moment): boolean {
    const diaSemana = fecha.day();
    const esFinDeSemana = (diaSemana === 0 || diaSemana === 6); // Domingo o Sábado
    const esFestivo = this.diasFestivos.includes(fecha.format('YYYY-MM-DD'));
    return !esFinDeSemana && !esFestivo;
  }

  calcularPagoDiario(monto: number, diasHabiles: number): void {
    if (diasHabiles > 0) {
      const pagoDiario = monto / diasHabiles;
      this.formRegistrar.get('validaPagoDiario')?.setValue(pagoDiario.toFixed(2).toString());
    }
  }

  actualizarCapital(monto: number): void {
    // Encontrar el valor de capital más cercano
    const capital = this.valoresCapital.reduce((prev, curr) =>
      Math.abs(curr - monto) < Math.abs(prev - monto) ? curr : prev
    );
    this.solicitud.capital = capital;
  }

  registra(): void {
    if (this.formRegistrar.valid) {
      // Asignar el idUsuarioPrestatario
      const idUsuarioPrestatario = Number(this.formRegistrar.get('idUsuarioPrestatario')?.value);

      this.solicitud.usuarioActualizacion = this.tokenService.getUserId();
      this.solicitud.usuarioRegistro = this.tokenService.getUserId();
      this.solicitud.usuarioPrestatario = idUsuarioPrestatario; // Asignar idUsuarioPrestatario

      this.solicitud.capital = this.solicitud.capital;
      this.solicitud.dias = Number(this.formRegistrar.get('validaDias')?.value);
      this.solicitud.pagoDiario = Number(this.formRegistrar.get('validaPagoDiario')?.value);
      this.solicitud.fechaInicioPrestamo = new Date(this.solicitud.fechaInicioPrestamo = new Date(this.formRegistrar.get('validaFechaInicioPrestamo')?.value || ''));
      this.solicitud.fechaFinPrestamo = new Date(this.solicitud.fechaFinPrestamo = new Date(this.formRegistrar.get('validaFechaFinPrestamo')?.value || ''));

      console.log('Solicitud antes de enviar:', this.solicitud);

      this.solicitudService.registrar(this.solicitud).subscribe(
        x => {
          Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje });
          this.resetForm();
        }
      );
    }
  }

  resetForm(): void {
    this.solicitud = {
      capital: 0,
      montoPagar: 0,
      fechaInicioPrestamo: new Date(),
      fechaFinPrestamo: new Date(),
      dias: 0,
      pagoDiario: 0,
      EstadoSolicitud: {
        idEstados: 1
      },
      usuarioRegistro:
         1
      ,
      usuarioActualizacion:
         1
      ,
      usuarioPrestatario:
         -1

    };

    this.formRegistrar.reset();
  }
}
