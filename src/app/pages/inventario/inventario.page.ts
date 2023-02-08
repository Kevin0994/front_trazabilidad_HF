import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {
  AlertController, ModalController,
} from '@ionic/angular';
import { DatatableComponent, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';
import { ModalDescontarStockPage } from '../../modals/modal-descontar-stock/modal-descontar-stock.page'
import { ProviderMetodosCrud } from 'src/provider/methods/providerMetodosCrud.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  @ViewChild(DatatableComponent) tableMain: DatatableComponent;
  @ViewChild('editTmpl' , { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl' , { static: true }) hdrTpl: TemplateRef<any>;

  public title: any = 'Productos';
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showButtons: boolean = true;
  public datosTable: any = [];
  public productos: any = [];
  temp: any = [];
  result: string;
  cols: any = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private proveedor: ProviderService,
    public alertController: AlertController,
    private providerMensajes:ProviderMensajes,
    public modalController:ModalController,
    private providerMetodosCrud: ProviderMetodosCrud,
    private androidPermissions: AndroidPermissions,
  ) {
    
  }

  ionViewWillEnter() {

  }

  ngOnInit() {
    this.initTable();
  }

  initTable() {
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
      }
    ]
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
        this.productos.map((doc, index, array) =>{
          array[index]['stock']= doc.stock + " gr";
          return array[index];
        });
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

  
  async onSelect({ selected }) {
    console.log(selected[0].codigo, this.selected);
    let reporte;

   const alert = await this.alertController.create({
      header: 'Atencion',
      message: 'Elija una de las opciones',
      buttons: [
        {
          text: 'Retirar Stock',
          handler: () => {
            if (this.showSemi) {
              this.DescontarStockModal(selected[0].id,'inventarioProductoSemifinales/put/stock/');
            }
            if (this.showFinal) {
              this.DescontarStockModal(selected[0].id,'inventarioProductoFinales/put/stock/');
            }
          }
        }, {
          text: 'Generar Reporte',
          handler: () => {
            this.providerMensajes.showLoading();
            this.androidPermissions.checkPermission(
              this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((result)=> {
                if(!result.hasPermission){
                  this.providerMensajes.dismissLoading();
                  this.checkPermissions();
                }
              }),(err)=>{
                this.providerMensajes.dismissLoading();
                this.providerMensajes.ErrorMensajePersonalizado('Error al acceder a los permisos del telefono')
              }
            if(this.showSemi){
              this.proveedor.obtenerDocumentosPorId('inventarioProSemi/documents/',selected[0].id).then(data =>{
                console.log(data);
                reporte = data;
                let productos =  this.ReordenarProductosporLote(selected[0],reporte);
                this.exportAsXLSX(productos);
              })
            }

            if(this.showFinal){
              this.proveedor.obtenerDocumentosPorId('inventarioProductoFinal/documents/',selected[0].id).then(data =>{
                console.log(data);
                reporte = data;
                let productos =  this.ReordenarProductosporLote(selected[0],reporte);
                this.exportAsXLSX(productos);
              })
            }
            this.providerMensajes.dismissLoading();
            return;
          }
        }
      ]
    });

    await alert.present();
  }

  async DescontarStockModal(productoId:any,Url:string){
    const modal = await this.modalController.create({
      component: ModalDescontarStockPage,
      cssClass: 'modalStock',
      componentProps:{
        'ProductoId':productoId,
        'Url': Url,
      }
    });

    modal.onDidDismiss().then(data => {
      if(data.data != undefined){ //verifica si recibe el nuevo producto al cerrar el modal
        this.OrganizarDataModel(data);
      }
    })

    return await modal.present();
  }

  OrganizarDataModel(data:any){
    let producto={ // reemplazamos el nuevo producto a una varible
      id: data.data.id,
      stock: data.data.stock,
    }
    console.log(producto);

    this.productos = this.providerMetodosCrud.actualizarDatosInventario(producto,this.productos);
    this.OrdenarTabla(this.productos);
    console.log('tabla producto');
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
    this.tableMain.offset = 0;
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

  checkPermissions(){
    this.androidPermissions.requestPermissions(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
    );
}

}
