import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';


@Injectable()

export class ProviderMensajes {

  constructor() { }

  async MensajeDeleteServidor(alertController:AlertController){
    const alert = await alertController.create({
      header: 'Exito',
      message: 'La eliminacion se completo con exito',
      buttons: ['OK']
    });

    await alert.present();
  }

  async ErrorMensajeServidor(alertController:AlertController) {
    const alert = await alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

  async MensajeModalServidor(modalController:ModalController,alertController:AlertController,Objeto:any) {
    const alert = await alertController.create({
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

  async ErrorMensajePersonalizado(alertController:AlertController,mensaje:any){
    const alert = await alertController.create({
      header: 'Error del servidor',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async MessegeValiteForm(alertController:AlertController){
    const alert = await alertController.create({
      header: 'Datos incompletos',
      message: 'Tienes que llenar todos los datos',
      buttons: ['OK']
    });

    await alert.present();
    return;
  }

  async MessegeValiteFormPersonalizado(alertController:AlertController,mensaje:any){
    const alert = await alertController.create({
      header: 'Datos incompletos',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
    return;
  }
}
