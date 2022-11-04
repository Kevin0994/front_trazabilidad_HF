import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-ingresos-inventario-semi',
  templateUrl: './ingresos-inventario-semi.page.html',
  styleUrls: ['./ingresos-inventario-semi.page.scss'],
})
export class IngresosInventarioSemiPage implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('editTmpl' , { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl' , { static: true }) hdrTpl: TemplateRef<any>;

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
      this.cols = [
        {
          name: 'N°',
          prop: 'id',
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
          cellTemplate: this.editTmpl,
          headerTemplate: this.hdrTpl,
          name: 'Peso MP',
          prop: 'pesoMp'
        },
        {
          name: 'Lote MP',
          prop: 'loteMp_st'
        },
        {

          name: 'Fecha Entrada',
          prop: 'fechaEntrada'
        },
        {
          name: 'Fecha Salida',
          prop: 'fechaSalida'
        },
        {
          cellTemplate: this.editTmpl,
          headerTemplate: this.hdrTpl,
          name:'Peso Final',
          prop: 'pesoFinal'
        },
        {
          name:'N° Fundas',
          prop: 'unidades'
        },
        {
          name: 'Conversion',
          prop: 'conversion'
        },
        {
          name: 'Responsable',
          prop: 'responsable'
        }
      ]
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

  ionViewWillEnter(){
  }

  LoadDatos(){
    this.proveedor.obtenerDocumentos('inventarioProSemi/terminado/documents').then(data => {
      this.productos=data;
      this.temp=data;
      console.log(this.productos);
    }).catch(data => {
      console.log(data);
    })
  }

}