import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';
import { ProviderMetodosCrud } from 'src/provider/methods/providerMetodosCrud.service';

@Component({
  selector: 'app-cosecha-historial',
  templateUrl: './cosecha-historial.page.html',
  styleUrls: ['./cosecha-historial.page.scss'],
})
export class CosechaHistorialPage implements OnInit {

  cosechaHistorial:any=[];
  historial:any;
  cosecha:any;

  constructor(private proveedor: ProviderService,
    private providerMensajes: ProviderMensajes,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) {

    }

  ngOnInit() {

  }

  ionViewWillEnter(){
   this.loadDatos();
  }

  async loadDatos(){
    await this.providerMensajes.showLoading();
    this.proveedor.obtenerDocumentos('cosechasHistorial/documents').then(data => {
      if (this.proveedor.status) {
        this.cosechaHistorial=data;
        this.providerMensajes.dismissLoading();
      }
    }).catch(data => {
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajeServidor();
      console.log(data);
    })
  }


  async ValidarDelete(historial:any){
    console.log(historial);
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Seguro que desea elimar?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {

            this.providerMensajes.showLoading();

            var ingreso = historial.ingreso;
            var stock = historial.stock;
            var result =  stock - ingreso ;
            console.log(stock + ' '+ ingreso);
            console.log(result);

            this.cosecha = {
              stock: result,
              idHis: historial.idHistorial,
              ingreso: historial.ingreso,
              fecha: historial.fecha,
              responsable: historial.responsable,
            }

            console.log(this.cosecha);
            this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/delete/', historial.id,this.cosecha).then(data => {
              console.log(data);
              if (this.proveedor.status) {
                this.loadDatos();
                this.providerMensajes.dismissLoading();
                this.providerMensajes.MensajeDeleteServidor();
              }
            }).catch(data => {
              this.providerMensajes.dismissLoading();
              this.providerMensajes.ErrorMensajeServidor();
              console.log(data);
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
