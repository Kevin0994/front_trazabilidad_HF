import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';


@Injectable()

export class ProviderMensajes {

  public show = true;

  constructor(public alertController: AlertController,
    private loadingCtrl: LoadingController,) { }

  async MensajeDeleteServidor(){
    const alert = await this.alertController.create({
      header: 'Exito',
      message: 'La eliminacion se completo con exito',
      buttons: ['OK']
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

  async MensajeModalServidor(modalController:ModalController,Objeto:any) {
    const alert = await this.alertController.create({
      header: 'Exito',
      message: 'El registro se completo con exito',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('cerrado');
            modalController.dismiss(Objeto);
          }
        }]
    });

    await alert.present();
  }

  async MensajePersonalizado(mensaje:any){
    const alert = await this.alertController.create({
      header: 'Atencion',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async ErrorMensajePersonalizado(mensaje:any){
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async MessegeValiteForm(){
    const alert = await this.alertController.create({
      header: 'Datos incompletos',
      message: 'Tienes que llenar todos los datos',
      buttons: ['OK']
    });

    await alert.present();
    return;
  }

  async MessegeValiteFormPersonalizado(mensaje:any){
    const alert = await this.alertController.create({
      header: 'Datos incompletos',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
    return;
  }

  async showLoading() {

    this.show = true;

    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
      translucent: true,
      spinner: 'circles',
    });

    return await loading.present();
  }

  dismissLoading(){

    this.show = false;

    this.loadingCtrl.dismiss();
  }
}
