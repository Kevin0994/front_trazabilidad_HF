import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { DatatableComponent, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
//import { IngresosInventarioSemiPage } from 'src/app/pages/ingresos-inventario/ingresos-inventario.page';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ActionSheetController } from '@ionic/angular';
import { ModalLeerNFCPage } from '../../modals/modal-leer-nfc/modal-leer-nfc.page';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';
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
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private nfc: NFC,
    private proveedor: ProviderService,
    public alertController: AlertController,
    private providerMensajes:ProviderMensajes,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.initTableSemi();
    this.proveedor
      .obtenerDocumentos('inventarioProSemi/terminado/documents')
      .then((data) => (this.inventorySemiFinalAll = data));
  }

  async onSelect({ selected }) {
    console.log('Select Event', selected[0].codigo, this.selected);
    let reporte;

   const alert = await this.alertController.create({
      header: 'Atencion',
      message: '¿Desea generar un reporte de este lote de producto?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {
            if(this.showSemi){
              this.proveedor.obtenerDocumentosPorId('inventarioProSemi/documents/',selected[0].id).then(data =>{
                console.log(data);
                reporte = data;
                let productos =  this.ReordenarProductosporLote(selected[0],reporte);
                this.exportAsXLSX(productos);
              })
              return;
            }

            if(this.showFinal){
              this.proveedor.obtenerDocumentosPorId('inventarioProductoFinal/documents/',selected[0].id).then(data =>{
                console.log(data);
                reporte = data;
                let productos =  this.ReordenarProductosporLote(selected[0],reporte);
                this.exportAsXLSX(productos);
              })
              return;
            }
          }
        }
      ]
    });

    await alert.present();
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
        prop: 'lote',
      },
      {
        name: 'Stock',
        prop: 'stock',
      },
    ];
  }

  CargarDatosTabla() {
    this.providerMensajes.showLoading();
    if (this.showSemi == true) {
      this.queryGetAPI('inventarioProSemi/documents');
    }
    if (this.showFinal == true) {
      this.queryGetAPI('inventarioProductoFinal/documents');
    }
  }

  queryGetAPI(url: any) {
    this.proveedor
      .obtenerDocumentos(url)
      .then((data) => {
        this.OrdenarTabla(data);
        this.productos = data;
        this.temp = data;
        this.providerMensajes.dismissLoading();
        console.log(this.productos);
      })
      .catch((data) => {
        this.providerMensajes.dismissLoading();
        this.providerMensajes.ErrorMensajeServidor();
        console.log(data);
      });
  }

  exportAsXLSX(reporte){
    this.proveedor.exportToExcel(reporte,'reporteHF_');
  }

  ReordenarProductosporLote(infoLote,productos){
    console.log(infoLote);
    let reporte = Array();
    productos.map(function (doc){
      doc.loteMp.map(function(mp,n){
        let document;
        if(n === 0){
          if(doc.pesoMp != undefined && doc.fechaSalida != undefined){
            document = {
              Codigo : infoLote.codigo,
              Nombre: infoLote.nombre,
              Lote: infoLote.lote,
              PesoFinal: doc.pesoFinal,
              FechaEntrada: doc.fechaEntrada,
              FechaSalida: doc.fechaSalida,
              PesoMateriaPrima: doc.pesoMp,
              MateriaPrima: mp.codigo,
              NombreMp: mp.nombre,
              coleccion: mp.collection,
              Retiro: mp.ingreso,
              LoteMp: mp.lote,
              Responsable: doc.responsable,
            }
          }else{
            document = {
              Codigo : infoLote.codigo,
              Nombre: infoLote.nombre,
              Lote: infoLote.lote,
              PesoFinal: doc.pesoFinal,
              FechaEntrada: doc.fechaEntrada,
              MateriaPrima: mp.codigo,
              NombreMp: mp.nombre,
              coleccion: mp.collection,
              Retiro: mp.ingreso,
              LoteMp: mp.lote,
              Responsable: doc.responsable,
            }
          }
        
        }else{
          document = {
            Codigo : '',
            Nombre: '',
            Lote: '',
            PesoFinal: '',
            FechaEntrada: '',
            MateriaPrima: mp.codigo,
            NombreMp: mp.nombre,
            coleccion: mp.collection,
            Retiro: mp.ingreso,
            LoteMp: mp.lote,
            Responsable: '',
          }
          if(doc.pesoMp != undefined && doc.fechaSalida != undefined){
            document = {
              Codigo : '',
              Nombre: '',
              Lote: '',
              PesoFinal: '',
              FechaEntrada: '',
              FechaSalida: '',
              PesoMateriaPrima: '',
              MateriaPrima: mp.codigo,
              NombreMp: mp.nombre,
              coleccion: mp.collection,
              Retiro: mp.ingreso,
              LoteMp: mp.lote,
              Responsable: '',
            }
          }else{
            document = {
              Codigo : '',
              Nombre: '',
              Stock: '',
              Lote: '',
              PesoFinal: '',
              FechaEntrada: '',
              MateriaPrima: mp.codigo,
              NombreMp: mp.nombre,
              coleccion: mp.collection,
              Retiro: mp.ingreso,
              LoteMp: mp.lote,
              Responsable: '',
            }
          }
        }
        reporte.push(document);
      })
    })
    console.log(reporte);
    return reporte;
  }

  ingresosGet() {
    if (this.showSemi == true) {
      const response: NavigationExtras = {
        state: {
          tabla: true,
        },
      };
      this.router.navigateByUrl('ingresos-inventario', response);
    }
    if (this.showFinal == true) {
      const response: NavigationExtras = {
        state: {
          tabla: false,
        },
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

  OrdenarTabla(productos:any=[]){
    let fecha = new Date().getMonth();
    productos.sort(function(a, b){ //Ordena el array de manera Descendente
      if(a.codigo > b.codigo){
          return 1
      } else if (a.codigo < b.codigo) {
          return -1
      } else {
          return 0
      }
   })
  }

}
