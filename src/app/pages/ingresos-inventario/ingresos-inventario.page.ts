import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

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
    private providerMensajes:ProviderMensajes,
    ) {
      this.response = this.router.getCurrentNavigation().extras.state.tabla;
      console.log(this.response);
    }

    ngOnInit() {
      this.loadColumnasTabla();
    }
  
  loadColumnasTabla(){
    this.providerMensajes.showLoading();
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
          name: 'Lote',
          prop: 'lote'
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
          name: 'Responsable',
          prop: 'responsable'
        }
      ]
      this.LoadDatos('inventarioProSemi/terminado/documents',true);
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
          name: 'Lote',
          prop: 'lote'
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
      this.LoadDatos('inventarioProductoFinal/all/documents',false);
    }
  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.productos = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ionViewWillEnter(){
  }

  ExportAsXLSX(){
    let data = this.ReordenarProductos();
    this.proveedor.exportToExcel(data,'reporteHF_');
  }

  ReordenarProductos(){
    let array = Array();
    this.productos.map(function (doc){
      doc.loteMp.map(function(mp,n){
        let document;
        if(n === 0){
          if(doc.pesoMp != undefined && doc.fechaSalida != undefined){
            document = {
              Codigo : doc.codigo,
              Nombre: doc.nombre,
              Lote: doc.lote,
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
              Codigo : doc.codigo,
              Nombre: doc.nombre,
              Lote: doc.lote,
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
        array.push(document);
      })
    })
    console.log(array);
    return array;
  }


  LoadDatos(url:any,type:boolean){
    this.proveedor.obtenerDocumentos(url).then(data => {
      this.OrdenarTabla(data,type);
      this.productos=data;
      this.temp=data;
      this.providerMensajes.dismissLoading();
      console.log(this.productos);
    }).catch(data => {
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajeServidor();
      console.log(data);
    })
  }

  OrdenarTabla(ingresos:any=[],type:boolean){
    if(type){
      ingresos.sort(function(a, b){ //Ordena el array de manera Descendente
        if(new Date(a.fechaSalida) < new Date(b.fechaSalida)){
            return 1
        } else if (new Date(a.fechaSalida) > new Date(b.fechaSalida)) {
            return -1
        } else {
            return 0
        }
     })
    }else{
      ingresos.sort(function(a, b){ //Ordena el array de manera Descendente
        if(new Date(a.fechaEntrada) < new Date(b.fechaEntrada)){
            return 1
        } else if (new Date(a.fechaEntrada) > new Date(b.fechaEntrada)) {
            return -1
        } else {
            return 0
        }
     })
    }
    
  }


  


}
