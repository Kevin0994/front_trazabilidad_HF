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

  @Input() Cosecha: any="init";
  @Input() type: any;
  @Input() id: any;
  formRegistro: FormGroup;
  public formulario:any;
  public cosecha:any;

  constructor(public proveedor: ProviderService,
    public fb: FormBuilder, 
    public navCtrl:NavController,
    public alertController: AlertController,
    public modalController:ModalController,) { 
      
    }

  ngOnInit() {
    if(this.type == 'Nuevo Registro'){
      this.newForm();
    }else{
      this.newForm();
      this.editForm();
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }


  newForm(){
    this.formRegistro = this.fb.group({
      'nombre': new FormControl("",Validators.required),
      'codigo': new FormControl("",Validators.required),
      'fecha': new FormControl("",Validators.required),
      'stock': new FormControl("",Validators.required),
      'peso': new FormControl("",Validators.required),
    })
  }

  editForm(){
    this.formRegistro =  this.fb.group({
      'nombre': new FormControl(this.Cosecha.nombre,Validators.required),
      'codigo': new FormControl(this.Cosecha.codigo,Validators.required),
      'fecha': new FormControl(this.Cosecha.fecha,Validators.required),
      'stock': new FormControl(this.Cosecha.peso_stock,Validators.required),
      'peso': new FormControl(this.Cosecha.peso_h,Validators.required),
    })
  }

  async saveProfile(){
    this.formulario = this.formRegistro.value;
    if(this.formRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    let date = new Date();

    if(this.type == 'Nuevo Registro'){
      this.cosecha = {
        nombre: this.formulario.nombre,
        codigo: this.formulario.codigo,
        fecha: this.formulario.fecha,
        peso_stock: this.formulario.stock,
        peso_h: this.formulario.peso,
        lote: date.getMonth() + 1,
        responsable: localStorage.getItem('Usuario'),
      }
      this.proveedor.InsertarCosecha(this.cosecha).then(data => {
        console.log(data);
        
        if(this.proveedor.status){
          this.MensajeServidor();
        }else{
          var result=this.proveedor.error;
          this.ErrorMensajeServidor();
          return; 
        }
      }).catch(data => {
        console.log(data);
      });
    }else{
      
      this.cosecha = {
        nombre: this.formulario.nombre,
        codigo: this.formulario.codigo,
        fecha: this.formulario.fecha,
        peso_stock: this.formulario.stock,
        peso_h: this.formulario.peso,
        lote: this.Cosecha.lote,
        responsable: this.Cosecha.responsable,
      }

      this.proveedor.ActualizarCosecha(this.id,this.cosecha).then(data => {
        console.log(data);
        
        if(this.proveedor.status){
          this.MensajeServidor();
        }else{
          var result=this.proveedor.error;
          this.ErrorMensajeServidor();
          return;
        }
      }).catch(data => {
        console.log(data);
      });
    }
  }

  async MensajeServidor(){
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

  async ErrorMensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

}
