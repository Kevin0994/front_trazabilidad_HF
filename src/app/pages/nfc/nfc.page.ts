import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.page.html',
  styleUrls: ['./nfc.page.scss'],
})
export class NfcPage implements OnInit {
  myListener: any = null;
  my;
  segment: string = 'read';
  product: any = {};
  findProduct: boolean = false;
  inventorySemiFinalAll: any;
  inventoryFinalAll: any;
  searchedSemiFinal: any;
  searchedFinal: any;
  handlerMessage: string;
  segmentInventory: string = 'productoSemiFinal';
  radioGroupValue: string = 'semifinal';
  constructor(
    private nfc: NFC,
    private ndef: Ndef,
    private proveedor: ProviderService,
    private alertController: AlertController
  ) {}
  // https://forum.ionicframework.com/t/remove-listener-nfc-plugin/113393
  //https://stackoverflow.com/questions/53190240/how-to-disable-nfc-eventlistener-when-before-second-value-read
  ngOnInit() {
    this.proveedor
      .obtenerDocumentos('inventarioProSemi/terminado/documents')
      .then((data) => {
        this.inventorySemiFinalAll = data;
        this.searchedSemiFinal = data;
      });
    this.proveedor
      .obtenerDocumentos('inventarioProductoFinal/all/documents')
      .then((data) => {
        this.inventoryFinalAll = data;
        this.searchedFinal = data;
      });
  }

  clearForm() {
    this.product = null;
    this.product.idProducto = "",
    this.product.estado = "",
    this.product.fechaEntrada = "",
    this.product.fechaSalida = "",
    this.product.loteMp[0].lote = [],
    this.product.nombre = "",
    this.product.pesoFinal = "",
    this.product.loteMp[0].salida = [];
    this.product.stock = ""
  }

  readNFC(againScan) {
    if(againScan) {
      this.findProduct = false;
    }

    if(this.myListener) {
      this.myListener.unsubscribe();
    }

    this.myListener = this.nfc.addNdefListener().subscribe((data) => {
      if(!data.tag.ndefMessage) {
        this.presentAlert('La etiqueta esta vacía');
        this.myListener.unsubscribe();
        return
      }
      let payload = this.nfc
        .bytesToString(data.tag.ndefMessage[0].payload)
        .substring(3);
      let productFound;
      if (this.radioGroupValue === 'semifinal')
        productFound = this.inventorySemiFinalAll.find(
          (product) => product.codigo === payload
        );
      else
        productFound = this.inventoryFinalAll.find(
          (product) => product.codigo === payload
        );

      if (productFound === undefined)
        this.presentAlert('No se ha encontrado el producto');
      else {
        this.product = productFound;
        this.findProduct = true;
        this.presentAlert('¡Producto encontrado!');
      }
      this.myListener.unsubscribe();
    });
  }

  writeNFC(code: string) {
    if(this.myListener) {
      this.myListener.unsubscribe();
    }
    this.myListener = this.nfc.addNdefListener().subscribe((data) => {
        let message = [this.ndef.textRecord(code)];
        this.nfc.write(message);
        this.presentAlert('¡Producto guardado!');
        this.myListener.unsubscribe();
      });
    // this.myListener.unsubscribe();
  }

  radioGroupChange(event) {
    this.radioGroupValue = event.target.value;
    console.log(this.radioGroupValue);
  }

  searchSemiFinal(event) {
    const text = event.target.value;
    this.searchedSemiFinal = this.inventorySemiFinalAll;
    if (text && text.trim() !== '') {
      this.searchedSemiFinal = this.searchedSemiFinal.filter(
        (e) => e.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1
      );
    }
  }

  searchFinal(event) {
    const text = event.target.value;
    this.searchedFinal = this.inventoryFinalAll;
    if (text && text.trim() !== '') {
      this.searchedFinal = this.searchedFinal.filter(
        (e) => e.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1
      );
    }
  }

  handleChange(ev) {
    this.segment = ev.target.value;
  }

  handleInventory(ev) {
    this.segmentInventory = ev.target.value;
    console.log(this.segmentInventory);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'confirmed';
          },
        },
      ],
    });

    this.myListener.unsubscribe();
    await alert.present();
  }
}
