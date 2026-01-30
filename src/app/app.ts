import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ValidacionesTaller } from './validaciones-taller'

interface Fila {
  cantidad: number;
  desc: string;
  prec: number;
  ivaPorc: number;
  iva: number;
  importe: number;
  total: number;
  errores?: {
    cantidad?: string;
    desc?: string;
    prec?: string;
    ivaPorc?: string;
  };
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  numRandom1: number = 0;
  numRandom2: number = 0;

  filas: Fila[] = [];
  baseIva21 = 0;
  baseIva10 = 0;
  baseIva4 = 0;
  baseIvaTotal = 0;

  iva21 = 0;
  iva10 = 0;
  iva4 = 0;

  ngOnInit(): void {
    this.anadirFila();
    this.generarCaptcha();
    this.formularioTalleres.get('cp')?.valueChanges.subscribe(valor => {
      if (valor) { // si tiene algún valor
        const digitos = valor.slice(0, 2);
        const provincia = ValidacionesTaller.provincias[digitos] || '';
        this.formularioTalleres.get('prov')?.setValue(provincia);
      } else {
        this.formularioTalleres.get('prov')?.setValue('');
      }
    });
  }

  generarCaptcha(){
    this.numRandom1 = Math.floor(Math.random() * 10) + 1
    this.numRandom2 = Math.floor(Math.random() * 10) +1

    this.actualizarValidadorCaptcha();
  }

  formularioTalleres = new FormGroup({
  nombreF: new FormControl<string | null>('', [Validators.required, Validators.maxLength(100)]),
  nombreC: new FormControl<string | null>('', [Validators.required, Validators.maxLength(100), Validators.minLength(2), ValidacionesTaller.noNum]),
  fecha: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/), ValidacionesTaller.actual]),
  direc: new FormControl<string | null>('', [Validators.required, Validators.minLength(3), Validators.pattern(/[A-Za-zÁÉÍÓÚáéíóú]/)]),
  cp: new FormControl<string | null>('', [Validators.required, Validators.minLength(5), Validators.maxLength(5), ValidacionesTaller.noLetras, ValidacionesTaller.provicias]),
  ciudad: new FormControl<string | null>('', [Validators.required, ValidacionesTaller.noNum, ValidacionesTaller.ciudades]),
  ncn: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^([0-9]{8}[A-Za-z]|[XYZxyz][0-9]{7}[A-Za-z]|[A-Za-z][0-9]{8})$/)]),
  tlf: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^[6789]\d{8}$/)]),
  gmail: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)]),

  prov: new FormControl<string | null>({ value: null, disabled: true }),
  captcha: new FormControl<number | null>(0, null),

  baseIva21: new FormControl<number | null>({ value: 0, disabled: true }),
  baseIva10: new FormControl<number | null>({ value: 0, disabled: true }),
  baseIva4: new FormControl<number | null>({ value: 0, disabled: true }),
  baseIvaTotal: new FormControl<number | null>({ value: 0, disabled: true }),
  
  iva21: new FormControl<number | null>({ value: 0, disabled: true }),
  iva10: new FormControl<number | null>({ value: 0, disabled: true }),
  iva4: new FormControl<number | null>({ value: 0, disabled: true })
  
});

  actualizarValidadorCaptcha() {
  const captchaControl = this.formularioTalleres.get('captcha');

  captchaControl?.setValidators([
    Validators.required,
    ValidacionesTaller.noLetras,
    ValidacionesTaller.numInvalido(this.numRandom1, this.numRandom2)
  ]);

  captchaControl?.updateValueAndValidity();
}

  anadirFila(){
    if(this.validarFila()){
      this.filas.push({
      cantidad: 1,
      desc: '',
      prec: 0,
      ivaPorc: 0,
      iva: 0,
      importe: 0,
      total: 0
    });
    }
  }

  validarCantidad(f: Fila){
  f.errores = f.errores || {};
  if (!f.cantidad || f.cantidad <= 0) {
    f.errores.cantidad = 'Debes añadir un valor superior a 0 en CANTIDAD ';
  } 
  else if(isNaN(f.cantidad)){
    f.errores.cantidad = 'Debes añadir un número entero en CANTIDAD';
  }else if(f.cantidad > 999){
    f.errores.cantidad = 'No puedes superar los 3 digitos en CANTIDAD';
  }  else {
    delete f.errores.cantidad;
  }
  this.calcularValores(f);
  }

  validarDescripcion(f: Fila){
    f.errores = f.errores || {};
    if (!f.desc || f.desc.trim() == '') {
    f.errores.desc = 'Debes añadir una DESCRIPCIÓN';
  } 
  else if(f.desc.length > 50){
    f.errores.desc = 'No puedes añadir más de 50 caracteres a DESCRIPCIÓN';
  }  else {
    delete f.errores.desc;
  }
  this.calcularValores(f);
  }

  validarPrecio(f: Fila){
    f.errores = f.errores || {};
    if (!f.prec || f.prec <= 0) {
      f.errores.prec = 'Debes añadir un valor superior a 0 en PRECIO';
    }else if(isNaN(f.prec)){
      f.errores.prec = 'Debes añadir un número a PRECIO';
    } else {
      delete f.errores.prec;
    }
    this.calcularValores(f);
  }

  validarPorc(f: Fila){
    f.errores = f.errores || {};
    if (!f.ivaPorc || f.ivaPorc <= 0) {
      f.errores.ivaPorc = 'Debes añadir una de las opciones del IVA';
    } else {
      delete f.errores.ivaPorc;
    }
    this.calcularValores(f);
  }

  borrarFila(index: number) {
   this.filas.splice(index, 1);
    this.recalcularTotales();
  }

  calcularValores(fila: Fila){
    fila.importe = +(fila.cantidad * fila.prec).toFixed(2);
    fila.iva = +(fila.importe * fila.ivaPorc / 100).toFixed(2);
    fila.total = +(fila.importe + fila.iva).toFixed(2);

    this.recalcularTotales();
  }

  recalcularTotales(){
  const base21 = this.filas.filter(f => Number(f.ivaPorc) === 21).reduce((s, f) => s + f.importe, 0);
  const base10 = this.filas.filter(f => Number(f.ivaPorc) === 10).reduce((s, f) => s + f.importe, 0);
  const base4  = this.filas.filter(f => Number(f.ivaPorc) === 4).reduce((s, f) => s + f.importe, 0);

  const iva21 = +(base21 * 0.21).toFixed(2);
  const iva10 = +(base10 * 0.10).toFixed(2);
  const iva4  = +(base4  * 0.04).toFixed(2);

  const total = +(base21 + base10 + base4 + iva21 + iva10 + iva4);
    console.log(base21)
  this.formularioTalleres.get('baseIva21')?.setValue(Number(base21.toFixed(2)));
  this.formularioTalleres.get('baseIva10')?.setValue(Number(base10.toFixed(2))); 
  this.formularioTalleres.get('baseIva4')?.setValue(Number(base4.toFixed(2))); 
  this.formularioTalleres.get('iva21')?.setValue(Number(iva21.toFixed(2))); 
  this.formularioTalleres.get('iva10')?.setValue(Number(iva10.toFixed(2))); 
  this.formularioTalleres.get('iva4')?.setValue(Number(iva4.toFixed(2))); 
  this.formularioTalleres.get('baseIvaTotal')?.setValue(Number(total.toFixed(2)));
  }

  
  
  submit(){
    if(this.validar()){
      this.mostrarResultados()
    }
  }

  validarFila(): boolean{
    let mensaje = '';
    this.filas.forEach((f, i) => {
      if (!f.desc) mensaje += `Fila ${i+1}: AÑADA LA DESCRIPCIÓN\n`;
      if (f.cantidad <= 0) mensaje += `Fila ${i+1}: AÑADA LA CANTIDAD\n`;
      if (f.prec <= 0) mensaje += `Fila ${i+1}: AÑADA EL PRECIO\n`;
      if(f.ivaPorc <= 0) mensaje += `Fila ${i+1}: AÑADA EL PORCENTAJE DE IVA`
    });
    if(mensaje){
      alert(mensaje)
      return false;
    }

    return true
  }

  validar(): boolean{
    const nombreF = this.formularioTalleres.get('nombreF');
    const nombreC = this.formularioTalleres.get('nombreC');
    const fecha = this.formularioTalleres.get('fecha');
    const direc = this.formularioTalleres.get('direc');

    const cp = this.formularioTalleres.get('cp');
    const ciudad = this.formularioTalleres.get('ciudad');
    const ncn = this.formularioTalleres.get('ncn');
    const tlf = this.formularioTalleres.get('tlf');
    const gamil = this.formularioTalleres.get('gmail');
    const captcha = this.formularioTalleres.get('captcha');

    let mensaje = '';

    if(nombreF?.invalid) mensaje = "ERROR EN EL NOMBRE DE LA FACTURA\n"
    if(nombreC?.invalid) mensaje = "ERROR EN TU NOMBRE\n"
    if(fecha?.invalid) mensaje = "ERROR EN LA FECHA\n"
    if(direc?.invalid) mensaje = "ERROR EN LA DIRECCIÓN\n"
    if(cp?.invalid) mensaje = "ERROR EN EL CODIGO POSTAL\n"
    if(ciudad?.invalid) mensaje = "ERROR EN LA CIUDAD\n"
    if(ncn?.invalid) mensaje = "ERROR EN EL NÚMERO DE DOCUMENTO\n"
    if(tlf?.invalid) mensaje = "ERROR EN EL TELEFONO\n"
    if(gamil?.invalid) mensaje = "ERROR EN EL CORREO ELECTRONICO\n"
    if(captcha?.invalid) mensaje = "CAPTCH INCORRECTO\n"

    if (this.filas.length === 0) mensaje += "Debes añadir al menos una fila.\n";
    this.filas.forEach((f, i) => {
      if (!f.desc) mensaje += `Fila ${i+1}: ERROR EN LA DESCRIPCIÓN\n`;
      if (f.cantidad <= 0) mensaje += `Fila ${i+1}: ERROR EN LA CANTIDAD\n`;
      if (f.prec <= 0) mensaje += `Fila ${i+1}: ERROR EN EL PRECIO\n`;
      if(f.ivaPorc <= 0) mensaje += `Fila ${i+1}: ERROR EN EL PORCENTAJE DE IVA`
    });
    
    if(mensaje){
      alert(mensaje)
      return false;
    }

    return true;
  }

  mostrarResultados(){
    const nombreF = this.formularioTalleres.get('nombreF')?.value;
    const nombreC = this.formularioTalleres.get('nombreC')?.value;
    const fecha = this.formularioTalleres.get('fecha')?.value;
    const direc = this.formularioTalleres.get('direc')?.value;

    const cp = this.formularioTalleres.get('cp')?.value;
    const prov = this.formularioTalleres.get('prov')?.value;
    const ciudad = this.formularioTalleres.get('ciudad')?.value;
    const ncn = this.formularioTalleres.get('ncn')?.value;
    const tlf = this.formularioTalleres.get('tlf')?.value;
    const gamil = this.formularioTalleres.get('gmail')?.value;

    const desc = this.formularioTalleres.get('desc')?.value;
    const cantidad = this.formularioTalleres.get('cantidad')?.value;
    const prec = this.formularioTalleres.get('prec')?.value;
    const ivaPorc = this.formularioTalleres.get('iva')?.value;

    const baseIva21 = this.formularioTalleres.get('baseIva21')?.value;
    const baseIva10 = this.formularioTalleres.get('baseIva10')?.value;
    const baseIva4 = this.formularioTalleres.get('baseIva4')?.value;

    const iva21 = this.formularioTalleres.get('iva21')?.value;
    const iva10 = this.formularioTalleres.get('iva10')?.value;
    const iva4 = this.formularioTalleres.get('iva4')?.value;

    const baseIvaTotal = this.formularioTalleres.get('baseIvaTotal')?.value;

    let mensaje = "";
    this.filas.forEach((f, i) => {
      mensaje += `Fila ${i+1}: ${f.desc} | Cantidad: ${f.cantidad} | Precio: ${f.prec} | IVA: ${f.ivaPorc}% | IVA: ${f.iva} | Importe: ${f.importe} | Total: ${f.total}\n` 
    });
    let mensCorrecto = 
      `${nombreF}.\n` +
      `Nombre: ${nombreC}.\n` +
      `Correo Electronico: ${gamil}.\n` +
      `Telefono: ${tlf}.\n` +
      `Fecha: ${fecha}.\n` +
      `Dirección: ${direc}.\n` +
      `Ciudad: ${ciudad}.\n` +
      `Código postal: ${cp}.\n` +
      `Provincia: ${prov}.\n` +
      `Número de documento: ${ncn}.\n\n` + mensaje +

      `BASE IVA 21%: ${baseIva21}.\n` +
      `BASE IVA 10%: ${baseIva10}.\n` +
      `BASE IVA 4%: ${baseIva4}.\n` +

      `IVA 21%: ${iva21}.\n` +
      `IVA 10%: ${iva10}.\n` +
      `IVA 4%: ${iva4}.\n` +

      `MAXIMO TOTAL: ${baseIvaTotal} €.\n` +
      
      
      "\nGRACIAS POR VISITAR TALLERES VIVES";
      alert(mensCorrecto)
  }
}
