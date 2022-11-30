import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
//import { IngresosInventarioSemiPage } from 'src/app/pages/ingresos-inventario/ingresos-inventario.page';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ActionSheetController } from '@ionic/angular';
import { ModalLeerNFCPage } from '../../modals/modal-leer-nfc/modal-leer-nfc.page';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('editTmpl', { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl', { static: true }) hdrTpl: TemplateRef<any>;

  public title: any = 'Productos';
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showButtons: boolean = true;
  inventorySemiFinalAll: any = [];
  productos: any = [];
  temp: any = [];
  result: string;
  cols: any = [];

  ColumnMode = ColumnMode;

  constructor(
    private router:Router,
    private nfc: NFC,
    private ndef: Ndef,
    private proveedor: ProviderService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.initTableSemi();
    this.proveedor
      .obtenerDocumentos('inventarioProductoSemifinal/proceso/documents')
      .then((data) => (this.inventorySemiFinalAll = data));
  }

  initTableSemi() {
    this.cols = [
      {
        name: 'N°',
        prop: 'codigo',
      },
      {
        name: 'Nombre',
        prop: 'nombre',
      },
      {
        name: 'Lote',
        prop: 'lote'
      },
      {
        name: 'Stock',
        prop: 'stock',
      },
    ];
  }

  CargarDatosTabla(){
    if(this.showSemi == true){
      this.queryGetAPI('inventarioProSemi/documents');
    }
    if(this.showFinal  == true){
      this.queryGetAPI('inventarioProductoFinal/documents');
    }
  }

queryGetAPI(url:any){
  this.proveedor.obtenerDocumentos(url).then(data => {
    this.productos=data;
    this.temp=data;
    console.log(this.productos);
  }).catch(data => {
    console.log(data);
  })
}

ingresosGet(){
  if(this.showSemi == true){
    const response: NavigationExtras = {
      state : {
        tabla: true
      }
    };
    this.router.navigateByUrl('ingresos-inventario', response);
  }
  if(this.showFinal  == true){
    const response: NavigationExtras = {
      state : {
        tabla: false
      }
    };
    this.router.navigateByUrl('ingresos-inventario', response);
  }

}

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log('Text input: ', val);
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
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

  readNFC() {
    this.nfc.addNdefListener().subscribe((data) => {
      let payload = this.nfc
        .bytesToString(data.tag.ndefMessage[0].payload)
        .substring(3);
      this.abrirModalLeerNFC(payload);
    });
    this.nfc.close();
  }

  async abrirModalLeerNFC(codeProduct: any) {
    const modal = await this.modalController.create({
      component: ModalLeerNFCPage,
      cssClass: 'my-custom-class',
      componentProps: {
        listInventory: this.inventorySemiFinalAll,
        code: codeProduct,
      },
    });

    modal.present();
    await modal.onWillDismiss();
  }
}
