import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
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

  cols: any = [];

  ColumnMode = ColumnMode;

  constructor(
    private proveedor: ProviderService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private modalController: ModalController,
    private nfc: NFC,
    private ndef: Ndef
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

  // writeNFC() {
  //   this.nfc.addNdefListener().subscribe((data) => {
  //     let message = [this.ndef.textRecord('Ya funciona')];
  //     this.nfc.write(message);
  //   });
  // }

  filterInventory() {
    let findProduct = this.productos.filter(
      (product) => product.id === '0xFvqT4UJMx5bbj8eQPn'
    );
    console.log('Pruduct founded: ', findProduct[0]);
  }

  // readNFC() {
  //   this.nfc.close();
  //   this.nfc.addNdefListener().subscribe((data) => {
  //     let message = this.nfc
  //       .bytesToString(data.tag.ndefMessage[0].payload)
  //       .substring(3);
  //     this.showAlert('Probando NFC', message, 'success');
  //   });
  // }
}
