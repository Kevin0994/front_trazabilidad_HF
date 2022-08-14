import { Component, Input, OnInit } from '@angular/core';

import { AlertController, ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProviderService } from '../../../provider/ApiRest/provider.service'

//import { cosecha } from 'src/app/models/cosecha.interface';


@Component({
  selector: 'app-modal-cosecha',
  templateUrl: './modal-cosecha.page.html',
  styleUrls: ['./modal-cosecha.page.scss'],
})
export class ModalCosechaPage implements OnInit {

  @Input() Historial: any = "init";
  @Input() type: any;
  @Input() id: any;
  @Input() accion: any;

  formRegistro: FormGroup;
  private nombreCosecha: string;
  private codigoCosecha: string;
  public selectedItem:any=[];
  private formulario: any;
  private cosecha: any;
  private historial: any=[];
  public lista: any;
  private busquedaStock: any;
  private fechaHis: any;


  constructor(public proveedor: ProviderService,
    public fb: FormBuilder,
    public navCtrl: NavController,
    public alertController: AlertController,
    public modalController: ModalController,) {

  }

  ngOnInit() {
    if (this.type == 'Nuevo Registro') {
      this.newForm();
    } else {
     this.editForm();
    }
  }

  ionViewWillEnter() {
    this.proveedor.obtenerDocumentos('listaCosechas/documents').then(data => {
      this.lista = data;
    }).catch(data => {
      console.log(data);
    })
  }


  closeModal() {
    this.modalController.dismiss();
  }


  newForm() {
    this.formRegistro = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'codigo': new FormControl("", Validators.required),
      'peso': new FormControl("", Validators.required),
    })
  }

  editForm() {
    this.nombreCosecha = this.Historial.nombre;
    this.codigoCosecha = this.Historial.codigo;
    this.selectedItem = {
      nombre:this.nombreCosecha,
      codigo:this.codigoCosecha,
    };
    const fecha = new Date(this.Historial.fecha);
    let day = fecha.getDate()
    let month = fecha.getMonth() + 1
    let year = fecha.getFullYear()
    this.formRegistro = this.fb.group({
      'nombre': new FormControl(this.selectedItem, Validators.required),
      'codigo': new FormControl(this.Historial.codigo, Validators.required),
      'fecha': new FormControl(`${year}-0${month}-${day}`, Validators.required),
      'peso': new FormControl(this.Historial.ingreso, Validators.required),
    })
    this.formRegistro.controls.codigo.disable();
  }

  handleChange(ev) {
    this.formulario = this.formRegistro.value;
    this.nombreCosecha = ev.detail.value.nombre;
    this.codigoCosecha = ev.detail.value.codigo;
    this.formRegistro.controls.codigo.setValue(this.codigoCosecha);
    this.formRegistro.controls.codigo.disable();
    console.log(this.formRegistro);
  }


  async Registro() {
    this.formulario = this.formRegistro.value;
    if (this.formRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    if (this.type == 'Nuevo Registro') {
      this.saveProfile();
    } else {
      this.editProfile();
    }
  }

  async saveProfile() {
    this.formulario = this.formRegistro.value;

    var idHistorial = Math.random().toString(36).substr(2, 9);

    let loteCalculado = new Date().getMonth() + 1;

    const hist={
      id: idHistorial,
      ingreso: this.formulario.peso,
      fecha: new Date().toString(),
      responsable: localStorage.getItem('Usuario'),
    }

    this.historial.push(hist);

    this.proveedor.BuscarStockCosecha('cosechaStock/',this.nombreCosecha, loteCalculado).then(data => {
      if (Object.entries(data).length != 0) {
        this.busquedaStock = data[0];
        var peso = this.formulario.peso;
        var stock = this.busquedaStock.stock
        this.cosecha = {
          stock: parseInt(peso) + stock,
          idHis: idHistorial,
          ingreso: this.formulario.peso,
          fecha: new Date().toString(),
          responsable: localStorage.getItem('Usuario'),
        }

        console.log(this.cosecha);
        this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/post/',this.busquedaStock.id, this.cosecha).then(data => {
          console.log(data);
          if (this.proveedor.status) {
            this.MensajeServidor();
          } else {
            this.ErrorMensajeServidor();
            return;
          }
        }).catch(data => {
          console.log(data);
        });
      } else {
        this.cosecha = {
          nombre: this.nombreCosecha,
          codigo: this.codigoCosecha,
          lote: loteCalculado,
          stock: this.formulario.peso,
          historial: this.historial,
        }
        console.log(this.cosecha);
        this.proveedor.InsertarDocumento('cosechas/post',this.cosecha).then(data => {
          console.log(data);
          if (this.proveedor.status) {
            this.MensajeServidor();
          } else {
            this.ErrorMensajeServidor();
            return;
          }
        }).catch(data => {
          console.log(data);
        });
      }
    }).catch(data => {
      console.log(data);
    });
  }

 async editProfile() {
    this.formulario = this.formRegistro.value;

    this.fechaHis = new Date(this.formulario.fecha);
    let loteCalculado = new Date(this.formulario.fecha).getMonth() + 1;

    const hist={
      id: this.Historial.idHistorial,
      ingreso: this.formulario.peso,
      fecha: this.fechaHis,
      responsable: localStorage.getItem('Usuario'),
    }

    this.historial.push(hist);

    if (this.nombreCosecha != this.Historial.nombre || this.formulario.peso != this.Historial.ingreso || loteCalculado != this.Historial.lote) {

        this.proveedor.BuscarStockCosecha('cosechaStock/',this.nombreCosecha, loteCalculado).then(data => {

          if (Object.entries(data).length != 0) {

            this.busquedaStock = data[0];

            console.log("Cosecha Stock encontrado");

            if(this.Historial.nombre != this.nombreCosecha || loteCalculado != this.Historial.lote){

              console.log("Cosecha nombre o lote cambiado");

              this.cosecha = {
                stock: this.Historial.stock - this.formulario.peso,
                idHis: this.Historial.idHistorial,
                ingreso: this.Historial.ingreso,
                fecha: this.Historial.fecha,
                responsable: this.Historial.responsable,
              }
              console.log(this.cosecha);

              console.log("Eliminando Historial");

              this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/delete/', this.Historial.id,this.cosecha).then(data => {
                console.log(data);
                if (this.proveedor.status) {

                  var peso = this.formulario.peso;
                  var stock = this.busquedaStock.stock
                  this.cosecha = {
                    stock: parseInt(peso) + stock,
                    idHis: this.Historial.idHistorial,
                    ingreso: this.formulario.peso,
                    fecha: this.fechaHis,
                    responsable: localStorage.getItem('Usuario'),
                  }
                  console.log("Actualizando Cosechas stock");

                  console.log(this.cosecha);
                  this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/post/',this.busquedaStock.id, this.cosecha).then(data => {
                    console.log(data);
                    if (this.proveedor.status) {
                      this.MensajeServidor();
                    } else {
                      this.ErrorMensajeServidor();
                      return;
                    }
                  }).catch(data => {
                    console.log(data);
                  });

                } else {
                  this.ErrorMensajeServidor();
                  return;
                }
              }).catch(data => {
                console.log(data);
              });

            }else{

              console.log("Cosecha Stock peso cambiado");

              var pesoAnterior = this.Historial.ingreso;
              var peso = this.formulario.peso;

              if (pesoAnterior > peso) {

                var result = pesoAnterior - peso;
                var valorstock = this.Historial.stock - result;

                this.cosecha = {
                  stock: valorstock,
                  idHis: this.Historial.idHistorial,
                  ingreso: this.Historial.ingreso,
                  fecha: this.Historial.fecha,
                  responsable: this.Historial.responsable,
                }

                this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/delete/', this.Historial.id,this.cosecha).then(data => {
                  console.log(data);
                  if (this.proveedor.status) {

                    this.cosecha = {
                      stock: valorstock,
                      idHis: this.Historial.idHistorial,
                      ingreso: this.formulario.peso,
                      fecha: this.fechaHis,
                      responsable: localStorage.getItem('Usuario'),
                    }
                    console.log("Actualizando Cosechas stock");

                    console.log(this.cosecha);
                    this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/post/',this.Historial.id, this.cosecha).then(data => {
                      console.log(data);
                      if (this.proveedor.status) {
                        this.MensajeServidor();
                      } else {
                        this.ErrorMensajeServidor();
                        return;
                      }
                    }).catch(data => {
                      console.log(data);
                    });

                  } else {
                    this.ErrorMensajeServidor();
                    return;
                  }
                }).catch(data => {
                  console.log(data);
                });


              }else{

                var result =  peso - pesoAnterior ;
                var valorstock = parseInt(this.Historial.stock + result);

                this.cosecha = {
                  stock: valorstock,
                  idHis: this.Historial.idHistorial,
                  ingreso: this.Historial.ingreso,
                  fecha: this.Historial.fecha,
                  responsable: this.Historial.responsable,
                }

                console.log("Cosecha Stock peso mayor:");
                this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/delete/', this.Historial.id,this.cosecha).then(data => {
                  console.log(data);
                  if (this.proveedor.status) {

                    this.cosecha = {
                      stock: valorstock,
                      idHis: this.Historial.idHistorial,
                      ingreso: this.formulario.peso,
                      fecha: this.fechaHis,
                      responsable: localStorage.getItem('Usuario'),
                    }
                    console.log("Actualizando Cosechas stock");

                    console.log(this.cosecha);
                    this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/post/',this.Historial.id, this.cosecha).then(data => {
                      console.log(data);
                      if (this.proveedor.status) {
                        this.MensajeServidor();
                      } else {
                        this.ErrorMensajeServidor();
                        return;
                      }
                    }).catch(data => {
                      console.log(data);
                    });

                  } else {
                    this.ErrorMensajeServidor();
                    return;
                  }
                }).catch(data => {
                  console.log(data);
                });
              }
            }

          }else{

            this.cosecha = {
              stock: this.Historial.stock - this.formulario.peso,
              idHis: this.Historial.idHistorial,
              ingreso: this.Historial.ingreso,
              fecha: this.Historial.fecha,
              responsable: this.Historial.responsable,
            }
            console.log(this.cosecha);

            console.log("Eliminando Historial");

            this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/delete/', this.Historial.id,this.cosecha).then(data => {

              this.cosecha = {
                nombre: this.nombreCosecha,
                codigo: this.codigoCosecha,
                lote: loteCalculado,
                stock: this.formulario.peso,
                historial: this.historial,
              }
              console.log("Insertando nueva CosechaStock");

              this.proveedor.InsertarDocumento('cosechas/post',this.cosecha).then(data => {
                console.log(data);
                if (this.proveedor.status) {
                  this.MensajeServidor();
                } else {
                  this.ErrorMensajeServidor();
                  return;
                }
              }).catch(data => {
                console.log(data);
              });
            }).catch(data => {
              console.log(data);
            });

          }
        }).catch(data => {
          console.log(data);
        });
    } else {

      this.closeModal();
    }
  }


  /* async ActualizarHistorial(){
    
  } */

  async MensajeServidor() {
    const alert = await this.alertController.create({
      header: 'Registro',
      message: 'El registro se completo con exito',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.closeModal();
          }
        }]
    });

    await alert.present();
  }

  async ErrorMensajeServidor() {
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

}
