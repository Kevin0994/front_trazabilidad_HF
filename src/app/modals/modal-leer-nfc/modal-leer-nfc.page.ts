import { Component, OnInit, Input } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { producto } from 'src/app/models/producto.interface';

@Component({
  selector: 'app-modal-leer-nfc',
  templateUrl: './modal-leer-nfc.page.html',
  styleUrls: ['./modal-leer-nfc.page.scss'],
})
export class ModalLeerNFCPage implements OnInit {
  @Input() listInventory: any = [];
  @Input() code: any = '';
  product: any = {};
  findProduct: any = [];
  payloadMessage: any = 'Vacio';
  constructor(
    private nfc: NFC,
    private ndef: Ndef,
    private modalCtrl: ModalController,
    private provider: ProviderService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    console.log('All list inventory: ', this.listInventory);
    this.findProduct = this.listInventory.filter(
      (product) => product.idProducto === this.code
    );
    this.product = this.findProduct[0];
    // this.readNFC();
  }

  async presentAlert(messageAlert: any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: messageAlert,
      buttons: ['OK'],
    });

    await alert.present();
  }

  resetProduct() {
    let auxiliar: producto = {
      loteMp_st: [0],
      loteMp: [0],
      idProducto: '',
      id: '',
      stock: 0,
      nombreMp: '',
      nombre: '',
      lote: 0,
      pesoMp: 0,
      fechaEntrada: '',
      responsable: '',
      estado: '',
    };
    this.findProduct = [];
    this.product = auxiliar;
  }

  close() {
    this.nfc.cancelScan().then((m) => this.presentAlert(m));
    return this.modalCtrl.dismiss(null, 'cerrar');
  }
}
