import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from '../../security/token.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { CrudUsuarioActualizarComponent } from '../crud-usuario-actualizar/crud-usuario-actualizar.component';

@Component({
  selector: 'app-crud-prestamista',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-prestamista.component.html',
  styleUrl: './crud-prestamista.component.css'
})
export class CrudPrestamistaComponent {
  dataSource : any;

  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns = ["idUsuario","nombre","apellido","dni","telefono","usuario","direccion","acciones"];

  filtro: string = "";

  objUsuario: Usuario = {} ;

  constructor(private dialogService: MatDialog,
    private usuarioService: UsuarioService,
    private tokenService: TokenService ){
this.objUsuario.idUsuario = tokenService.getUserId();
}


refreshTable(){
  this.usuarioService.listaUsuariosDeUnUsuario(this.objUsuario.idUsuario!).subscribe(data => {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }, error => {
    Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
  });
}

openDialogActualizar(obj: Usuario) {
  console.log(">>> openDialogActualizar [ini]");
  console.log("obj: ", obj);
  const dialogRef = this.dialogService.open(CrudUsuarioActualizarComponent, { data: obj });
  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed with result:', result);
    if (result != null && (result === 1 || result === 2)) {
      this.refreshTable();
    }
  });
  console.log(">>> openDialogActualizar [fin]");
}

}
