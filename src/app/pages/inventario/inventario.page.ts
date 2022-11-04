import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('editTmpl' , { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl' , { static: true }) hdrTpl: TemplateRef<any>;

  public title:any="Productos";
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showButtons: boolean = true;
  productos:any = [];
  temp:any = [];

  cols:any=[];

  ColumnMode = ColumnMode;


  constructor(private proveedor: ProviderService,
    private alertController: AlertController,
    private navCtrl:NavController,
    private modalController:ModalController) {
    }

    ngOnInit() {
     this.initTableSemi();
    }


  initTableSemi(){
    this.cols = [
      {
        name: 'N°',
        prop: 'codigo',
      },
      {
        name: 'Nombre',
        prop: 'nombre'
      },
      {
        name: 'Materia Prima',
        prop: 'nombreMp'
      },
      {
        name: 'Lote',
        prop: 'lote'
      },
      {
        name: 'Stock',
        prop: 'stock'
      },
    ]
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

  ionViewWillEnter(){
  }

}
