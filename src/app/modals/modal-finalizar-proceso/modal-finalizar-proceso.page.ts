import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-modal-finalizar-proceso',
  templateUrl: './modal-finalizar-proceso.page.html',
  styleUrls: ['./modal-finalizar-proceso.page.scss'],
})
export class ModalFinalizarProcesoPage implements OnInit {

  @Input() idProceso: any;
  @Input() pesoMp: any;
  public formRegistro: FormGroup;
  private formulario:any;
  private producto:any;

  constructor(public proveedor: ProviderService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private modalController:ModalController,) { }

  ngOnInit() {
    this.newForm();
  }

  newForm(){
    this.formRegistro = this.fb.group({
      'fundas': new FormControl("",Validators.required),
      'peso': new FormControl("",Validators.required),
    })
  }

  closeModal(){
    this.modalController.dismiss();
  }

  async actualizarProducto(){
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
    const alert = await this.alertController.create({
      header: 'Atencion',
      message: '¿Seguro que desea terminar el proceso?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {
            this.producto = {
              fechaSalida: new Date().toLocaleString(),
              n_fundas: this.formulario.fundas, //numero de fundas
              peso_ps: this.formulario.peso, //peso producto semifinal
              conversion: this.pesoMp/this.formulario.peso,
            }

            console.table(this.producto);
            this.proveedor.actualizarDocumento('productoSemifinales/put/',this.idProceso,this.producto).then(data => {
              console.log(data);
              if(this.proveedor.status){
                this.MensajeServidor();
              }else{
                this.ErrorMensajeServidor();
                return;
              }
            }).catch(data => {
              console.log(data);
            });
          }
        }
      ]
    });

    await alert.present();
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
