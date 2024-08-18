import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { IndexComponent } from './index/index.component';
import { AgregarJefeComponent } from './components/agregar-jefe/agregar-jefe.component';
import { AgregarPrestamistaComponent } from './components/agregar-prestamista/agregar-prestamista.component';
import { AgregarPrestatarioComponent } from './components/agregar-prestatario/agregar-prestatario.component';
import { CrudUsuarioComponent } from './components/crud-usuario/crud-usuario.component';
import { CrudPrestamistaComponent } from './components/crud-prestamista/crud-prestamista.component';
import { CrudJefeComponent } from './components/crud-jefe/crud-jefe.component';
import { AgregarSolicitudComponent } from './components/agregar-solicitud/agregar-solicitud.component';
import { ListadoSolicitudesComponent } from './components/listado-solicitudes/listado-solicitudes.component';

export const routes: Routes = [
    {path:"verRegistroJefe", component:AgregarJefeComponent },
    {path:"verRegistroPrestamista", component:AgregarPrestamistaComponent },
    {path:"verRegsitroPrestatario", component:AgregarPrestatarioComponent },
    {path:"verRegistroSolicitud", component:AgregarSolicitudComponent },


    {path:"verCrudUsuario", component:CrudUsuarioComponent },
    {path:"verCrudPrestamista", component:CrudPrestamistaComponent },
    {path:"verCrudJefes", component:CrudJefeComponent },

    {path:"verListaSolicitud", component:ListadoSolicitudesComponent },


    { path: '', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
