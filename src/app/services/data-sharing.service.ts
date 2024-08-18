import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private montoSource = new BehaviorSubject<number>(0);
  selectedMonto = this.montoSource.asObservable();
  constructor() { }

  changeMonto(monto: number) {
    this.montoSource.next(monto);
  }
}
