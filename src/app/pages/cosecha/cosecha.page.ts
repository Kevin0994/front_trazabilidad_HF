import { Component, OnInit } from '@angular/core';

import {
  AlertController,
  NavController,
  ModalController,
} from '@ionic/angular';
import { ProviderService } from '../../../provider/ApiRest/provider.service';
import { ProviderMetodosCrud } from '../../../provider/methods/providerMetodosCrud.service';
import { ModalCosechaPage } from '../../modals/modal-cosecha/modal-cosecha.page';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-cosecha',
  templateUrl: './cosecha.page.html',
  styleUrls: ['./cosecha.page.scss'],
})
export class CosechaPage implements OnInit {
  public cosechas: any = []; //Guarda la lista de cosechas que le llegan de la Data Base
  private cosecha: any; //Guarda la cosecha que se creo
  temp: any = [];

  constructor(
    public proveedor: ProviderService,
    private providerMensajes:ProviderMensajes,
    private providerMetodosCrud: ProviderMetodosCrud,
    public alertController: AlertController,
    public navCtrl: NavController,
    public modalController: ModalController // private nfc: NFC, // private ndef: Ndef
  ) {}

  ngOnInit() {}

  //Peticion a la base de datos de la lista de cosechas
  ionViewWillEnter() {
    this.cargarDatos();
  }

  async cargarDatos(){
    await  this.providerMensajes.showLoading();
    this.proveedor.obtenerDocumentos('cosechas/documents').then(data => {
        if (this.proveedor.status) {
          this.cosechas = data;
          this.temp = data;
          this.providerMensajes.dismissLoading();
        }
    }).catch(data => {
        this.providerMensajes.dismissLoading();
        this.providerMensajes.ErrorMensajeServidor();
        console.log(data);
    });
  }

  // writeNFC() {
  //   this.nfc.addNdefListener().subscribe((data) => {
  //     let message = [this.ndef.textRecord('Ya funciona')];
  //     this.nfc.write(message);
  //   });
  // }

  // Funcion para abrir el modal e ingresar una nueva cosecha
  async openModal() {
    const modal = await this.modalController.create({
      component: ModalCosechaPage,
      cssClass: 'modalCosecha',
      componentProps: {
        type: 'Nuevo Registro',
      },
    });

    modal.onDidDismiss().then((data) => {
      this.actualizarDatos(data);
    });
    return await modal.present();
  }

  actualizarDatos(data: any) {
    if (data.data != undefined) {
      //verifica si recibe la nueva cosecha al cerrar el modal
      this.cosecha = {
        // reemplazamos la nueva cosecha a una varible
        nombre: data.data.nombreN,
        codigo: data.data.codigo,
        stock: data.data.stockN / 1000,
        lote: data.data.loteN,
        loteMes: data.data.loteMes,
        status: data.data.status,
      };
      this.cosechas = this.providerMetodosCrud.actualizarDatosTablaCosecha(
        this.cosecha,
        this.cosechas
      );
      this.OrdenarTabla();
    }
  }

  OrdenarTabla() {
    this.cosechas.sort(function (a, b) {
      //Ordena el array de manera Descendente
      if (a.lote < b.lote) {
        return 1;
      } else if (a.lote > b.lote) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });
    console.log(temp);
    // update the rows
    this.cosechas = temp;
  }
}
