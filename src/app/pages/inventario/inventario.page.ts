import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { ActionSheetController } from '@ionic/angular';
import { ModalLeerNFCPage } from '../../modals/modal-leer-nfc/modal-leer-nfc.page';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('editTmpl', { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl', { static: true }) hdrTpl: TemplateRef<any>;

  productos: any = [];
  temp: any = [];
  result: string;
  cols: any = [];

  ColumnMode = ColumnMode;

  constructor(
    private proveedor: ProviderService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private modalController: ModalController,
    private nfc: NFC,
    private ndef: Ndef,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.cols = [
      {
        name: 'N°',
        prop: 'nproceso',
      },
      {
        name: 'Nombre',
        prop: 'nombreps',
      },
      {
        name: 'Materia Prima',
        prop: 'nombremp',
      },
      {
        name: 'Lote',
        prop: 'loteps',
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'Peso MP',
        prop: 'pesomp',
      },
      {
        name: 'Lote MP',
        prop: 'lotempst',
      },
      {
        name: 'Fecha Entrada',
        prop: 'fechaEntrada',
      },
      {
        name: 'Fecha Salida',
        prop: 'fechaSalida',
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'Fundas de Gr',
        prop: 'pesops',
      },
      {
        name: 'Numero de Fundas',
        prop: 'nfundas',
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'Peso Producto',
        prop: 'pesops',
      },
      {
        name: 'Conversion',
        prop: 'conversion',
      },
      {
        name: 'Responsable',
        prop: 'responsable',
      },
    ];
    this.LoadDatos();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.nombreps.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.productos = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ionViewWillEnter() {}

  LoadDatos() {
    this.proveedor
      .obtenerDocumentos('inventarioProSemi/terminado/documents')
      .then((data) => {
        this.productos = data;
        this.temp = data;
        console.log('List of products: ', this.productos);
      })
      .catch((data) => {
        console.log(data);
      });
  }

  showAlert(title: string, message: any, iconMessage: any) {
    Swal.fire({
      icon: iconMessage,
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#91bb35',
      heightAuto: false,
    });
  }

  writeNFC() {
    this.nfc.addNdefListener().subscribe((data) => {
      let message = [this.ndef.textRecord('V2CGcBO0py7rXCEJK7Rc')];
      this.nfc.write(message);
    });
  }

  filterInventory() {
    let findProduct = this.productos.filter(
      (product) => product.id === '0xFvqT4UJMx5bbj8eQPn'
    );
    console.log('Pruduct founded: ', findProduct[0]);
    // filter our data
    const temp = this.temp.filter((data) => data.id === findProduct[0].id);
    console.log('Temp: ', temp);
    // update the rows
    this.productos = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  readNFC() {
    let message = '';
    this.nfc.close();
    this.nfc.addNdefListener().subscribe((data) => {
      message = this.nfc
        .bytesToString(data.tag.ndefMessage[0].payload)
        .substring(3);
      let findProduct = this.productos.filter(
        (product) => product.id === message
      );
      this.showAlert('Probando NFC', findProduct[0].fechaEntrada, 'success');
    });

    //   Swal.fire({
    //     title: '<strong>HTML <u>example</u></strong>',
    //     icon: 'info',
    //     html: `<p>${findProduct[0].id}</p>,
    // <p>${findProduct[0].fechaEntrada}</p>`,
    //     showCloseButton: true,
    //     showCancelButton: true,
    //     focusConfirm: false,
    //     confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
    //     confirmButtonAriaLabel: 'Thumbs up, great!',
    //     cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
    //     cancelButtonAriaLabel: 'Thumbs down',
    //   });
    return message;
  }

  async abrirModalLeerNFC() {
    const modal = await this.modalController.create({
      component: ModalLeerNFCPage,
      cssClass: 'my-custom-class',
      componentProps: {
        listInventory: this.productos,
      },
    });

    return await modal.present();
  }
}
