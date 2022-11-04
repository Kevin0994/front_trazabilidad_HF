import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController, NavParams, } from '@ionic/angular';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-ingresos-inventario',
  templateUrl: './ingresos-inventario.page.html',
  styleUrls: ['./ingresos-inventario.page.scss'],
})
export class IngresosInventario implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('editTmpl' , { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl' , { static: true }) hdrTpl: TemplateRef<any>;
  private response = false;
  productos:any = [];
  temp:any = [];
  cols:any=[];

  ColumnMode = ColumnMode;


  constructor(private router:Router,
    private proveedor: ProviderService,
    private alertController: AlertController,
    private navCtrl:NavController,
    private modalController:ModalController) {
      this.response = this.router.getCurrentNavigation().extras.state.tabla;
      console.log(this.response);
    }

    ngOnInit() {
      this.loadColumnasTabla();
    }
  
  loadColumnasTabla(){
    if(this.response == true){
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
      this.LoadDatos('inventarioProSemi/terminado/documents');
    }
    if(this.response == false){
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
      this.LoadDatos('inventarioProductoFinal/all/documents');
    }
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

  LoadDatos(url:any){
    this.proveedor.obtenerDocumentos(url).then(data => {
      this.productos=data;
      this.temp=data;
      console.log(this.productos);
    }).catch(data => {
      console.log(data);
    })
  }

}
