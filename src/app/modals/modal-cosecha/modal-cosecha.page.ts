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

  @Input() Cosecha: any = "init";
  @Input() type: any;
  @Input() id: any;
  @Input() accion: any;
  formRegistro: FormGroup;
  public formulario: any;
  public cosecha: any;
  public lista: any;
  public cosechaStock: any;
  public busquedaStock: any;

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
    this.formRegistro = this.fb.group({
      'nombre': new FormControl(this.Cosecha.nombre, Validators.required),
      'codigo': new FormControl(this.Cosecha.codigo, Validators.required),
      'fecha': new FormControl(this.Cosecha.fecha, Validators.required),
      'peso': new FormControl(this.Cosecha.peso_stock, Validators.required),
    })
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

    let date = new Date();

    this.cosecha = {
      nombre: this.formulario.nombre,
      codigo: this.formulario.codigo,
      fecha: date,
      peso_stock: this.formulario.peso,
      lote: date.getMonth() + 1,
      responsable: localStorage.getItem('Usuario'),
    }

    this.proveedor.InsertarCosecha(this.cosecha).then(data => {

      if (this.proveedor.status) {
        this.proveedor.BuscarStockCosecha(this.cosecha.nombre, this.cosecha.lote).then(data => {
          if (Object.entries(data).length != 0) {
            this.busquedaStock = data[0];
            var peso = this.formulario.peso;
            var stock = this.busquedaStock.stock
            this.cosechaStock = {
              stock: parseInt(peso) + stock
            }
            this.proveedor.ActualizarCosechaStock(this.busquedaStock.id, this.cosechaStock).then(data => {
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
            this.cosechaStock = {
              codigo: this.cosecha.codigo,
              lote: this.cosecha.lote,
              nombre: this.cosecha.nombre,
              stock: this.cosecha.peso_stock
            }
            this.proveedor.InsertarCosechaStock(this.cosechaStock).then(data => {
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
      } else {
        this.ErrorMensajeServidor();
        return;
      }
    }).catch(data => {
      console.log(data);
    });
  }

  async editProfile() {
    this.formulario = this.formRegistro.value;

    let date = new Date(this.formulario.fecha);

    this.cosecha = {
      nombre: this.formulario.nombre,
      codigo: this.formulario.codigo,
      fecha: this.formulario.fecha,
      peso_stock: this.formulario.peso,
      lote: date.getMonth() + 1,
      responsable: this.Cosecha.responsable,
    }

    if (this.formulario.nombre != this.Cosecha.nombre || this.formulario.peso != this.Cosecha.peso_stock || this.cosecha.lote != this.Cosecha.lote) {

      this.proveedor.ActualizarCosecha(this.id, this.cosecha).then(data => {

        if (this.proveedor.status) {
          this.proveedor.BuscarStockCosecha(this.cosecha.nombre, this.cosecha.lote).then(data => {

            if (Object.entries(data).length != 0) {

              console.log("Cosecha Stock encontrado");

              if(this.Cosecha.nombre != this.cosecha.nombre || this.cosecha.lote != this.Cosecha.lote){

                console.log("Cosecha nombre o lote cambiado");

                this.busquedaStock = data[0];
                var peso = this.formulario.peso;
                var stock = this.busquedaStock.stock
                this.cosechaStock = {
                  stock: parseInt(peso) + stock
                }
                
                console.log("Actualizando Cosechas stock");

                this.proveedor.ActualizarCosechaStock(this.busquedaStock.id, this.cosechaStock).then(data => {
                  console.log(data);
                  if (this.proveedor.status) {

                    console.log("Buscando CosechastockAnterior");
                    this.proveedor.BuscarStockCosecha(this.Cosecha.nombre, this.Cosecha.lote).then(data => {
                      
                      if (this.proveedor.status) {
                        this.busquedaStock = data[0];
                        var stock = this.busquedaStock.stock;
                        var resultado = stock - this.Cosecha.peso_stock;
                        this.cosechaStock = {
                          stock: resultado
                        }
                        if(resultado != 0){
                          console.log("Actualizando CosechastockAnterior");
                          this.UpdateCosechastock(this.busquedaStock.id, this.cosechaStock);
                        }else{
                          console.log("Eliminando CosechastockAnterior");
                          this.DeleteCosechastock(this.busquedaStock.id);
                        }  
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

                this.busquedaStock = data[0];
                var pesoAnterior = this.Cosecha.peso_stock;
                var peso = this.formulario.peso;

                if (pesoAnterior > peso) {

                  var result = pesoAnterior - peso;
                  var valorstock = this.busquedaStock.stock - result;

                  this.cosechaStock = {
                    stock: valorstock
                  }
                  //testeado
                  console.log("Cosecha Stock peso menor");
                  this.UpdateCosechastock(this.busquedaStock.id, this.cosechaStock);
                }else{

                  var result =  peso - pesoAnterior ;
                  var valorstock = parseInt(this.busquedaStock.stock)  + result;

                  this.cosechaStock = {
                    stock: valorstock
                  }
                  console.log("Cosecha Stock peso mayor:");
                  this.UpdateCosechastock(this.busquedaStock.id, this.cosechaStock);
                }
              }
                
            }else{
              this.cosechaStock = {
                codigo: this.cosecha.codigo,
                lote: this.cosecha.lote,
                nombre: this.cosecha.nombre,
                stock: this.cosecha.peso_stock
              }
              console.log("Insertando nueva CosechaStock");
              this.InsertNuevaCosechaStock(this.cosechaStock);
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
    } else {

      this.closeModal();
    }
  }

  async InsertNuevaCosechaStock(cosechaStock:any){
    this.proveedor.InsertarCosechaStock(cosechaStock).then(data => {
      if (this.proveedor.status) {
        console.log("Buscando CosechastockAnterior");
        this.SearchCosechastockAnterior(this.Cosecha.nombre, this.Cosecha.lote);    
      } else {
        this.ErrorMensajeServidor();
        return;
      }
    }).catch(data => {
      console.log(data);
    });
  }

  async SearchCosechastockAnterior(nombre:any,lote:any){
    this.proveedor.BuscarStockCosecha(nombre, lote).then(data => {                 
      if (this.proveedor.status) {
        this.busquedaStock = data[0];
        var stock = this.busquedaStock.stock;
        var resultado =  stock - this.Cosecha.peso_stock;
        this.cosechaStock = {
          stock: stock - resultado
        }

        if(resultado != 0){
          console.log("Actualizando CosechastockAnterior");
          this.UpdateCosechastock(this.busquedaStock.id, this.cosechaStock);
        }else{
          console.log("Eliminando CosechastockAnterior");
          this.DeleteCosechastock(this.busquedaStock.id);
        }  
      } else {
        this.ErrorMensajeServidor();
        return;
      }
    }).catch(data => {
      console.log(data);
    });  
  }

  async UpdateCosechastock(id:any,cosechaStock:any){
    this.proveedor.ActualizarCosechaStock(id,cosechaStock).then(data => {
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

  
  async DeleteCosechastock(id:any){
    this.proveedor.EliminarCosechaStock(id).subscribe(data => {
      console.log(data);
      if (this.proveedor.status) {
        this.MensajeServidor();
      } else {
        this.ErrorMensajeServidor();
        return;
      }
    });
  }

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
