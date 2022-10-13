import { Component, OnInit } from '@angular/core';

import { AlertController, NavController, ModalController } from '@ionic/angular';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { ModalCosechaPage } from '../../modals/modal-cosecha/modal-cosecha.page'

@Component({
  selector: 'app-cosecha',
  templateUrl: './cosecha.page.html',
  styleUrls: ['./cosecha.page.scss'],
})
export class CosechaPage implements OnInit {

  public cosechas:any=[]; //Guarda la lista de cosechas que le llegan de la Data Base
  private cosecha:any;    //Guarda la cosecha que se creo
  temp:any = [];

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) {
    }

  ngOnInit() {

  }

//Peticion a la base de datos de la lista de cosechas
  ionViewWillEnter(){
    this.proveedor.obtenerDocumentos('cosechas/documents').then(data => {
      this.cosechas = data;
      this.temp = data;
      console.log(this.cosechas);
    }).catch(data => {
      console.log(data);
    })
  }

// Funcion para abrir el modal e ingresar una nueva cosecha
  async openModal(){
    const modal = await this.modalController.create({
      component: ModalCosechaPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'type':'Nuevo Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      this.actualizarDatos(data);
    })
    return await modal.present();
  }

  actualizarDatos(data:any){
    if(data.data != undefined){ //verifica si recibe la nueva cosecha al cerrar el modal
      this.cosecha={ // reemplazamos la nueva cosecha a una varible 
        nombre: data.data.nombreN,
        codigo: data.data.codigo,
        stock: data.data.stockN / 1000,
        lote: data.data.loteN,
        status: data.data.status,
      }
      // Verifica si hay que ingresar o editar una cosecha
      if(this.cosecha.status != true){//Edita la cosecha de la tabla
        let foundIndex = this.cosechas.findIndex(obj =>
          obj.nombre == this.cosecha.nombre && obj.lote == this.cosecha.lote
        );
        this.cosechas[foundIndex].stock += this.cosecha.stock;
        console.table(this.cosechas[foundIndex]);
      }else{//Inserta la nueva cosecha en la tabla
        this.cosechas.push(this.cosecha);
        this.OrdenarTabla();
      }
    }
  }

  OrdenarTabla(){
    this.cosechas.sort(function(a, b){ //Ordena el array de manera Descendente
      if(a.lote < b.lote){
          return 1
      } else if (a.lote > b.lote) {
          return -1
      } else {
          return 0
      }
   })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });
    console.log(temp);
    // update the rows
    this.cosechas = temp;
  }


}

