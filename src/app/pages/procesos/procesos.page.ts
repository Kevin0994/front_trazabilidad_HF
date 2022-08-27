import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.page.html',
  styleUrls: ['./procesos.page.scss'],
})
export class ProcesosPage implements OnInit {

  public productos:any;

  constructor(private proveedor: ProviderService,
    private alertController: AlertController,
    private navCtrl:NavController,
    private modalController:ModalController) { }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.proveedor.obtenerDocumentos('productosSemi/documents').then(data => {
      this.productos=data;
      console.table(this.productos);
    }).catch(data => {
      console.log(data);
    })
  }

}
