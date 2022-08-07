import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ModalCosechaPage } from 'src/app/modals/modal-cosecha/modal-cosecha.page';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-cosecha-historial',
  templateUrl: './cosecha-historial.page.html',
  styleUrls: ['./cosecha-historial.page.scss'],
})
export class CosechaHistorialPage implements OnInit {

  cosechaHistorial:any=[];
  cosecha:any;
  cosechaStock:any;

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) {
      
    }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.proveedor.loadHistorialCosecha().then(data => {
      this.cosechaHistorial=data;
      console.log(this.cosechaHistorial)
    }).catch(data => {
      console.log(data);
    })
  }
  
  async EditCosecha(id:any){
    this.proveedor.BuscarCosecha(id).then(data => {
      this.cosecha= data;
      this.ModelPresent(id);
    }).catch(data => {
      console.log(data);
    })
  }

  async ValidarDelete(id:any,nombre:any,lote:any,peso:any){
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Seguro que desea elimar?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {
            this.SearchCosechaStock(id,nombre,lote,peso);
          }
        }
      ]
    });

    await alert.present();
  }

  async SearchCosechaStock(id:any,nombre:any,lote:any,peso:any){
    
    this.proveedor.BuscarStockCosecha(nombre, lote).then(data => {              
      
        var busquedaStock = data[0];
        var resultado = busquedaStock.stock - peso;
        this.cosechaStock = {
          stock: resultado
        }
        if(resultado != 0){
          console.log("Actualizando CosechastockAnterior");
          this.UpdateCosechastock(busquedaStock.id, this.cosechaStock);
          this.DeleteCosecha(id);
        }else{
          console.log("Eliminando CosechastockAnterior");
          this.DeleteCosechastock(busquedaStock.id);
          this.DeleteCosecha(id);
        }  
      
    }).catch(data => {
      console.log(data);
      return this.ErrorMensajeServidor();
    });  
  }

  async UpdateCosechastock(id:any,cosechaStock:any){
    this.proveedor.ActualizarCosechaStock(id,cosechaStock).then(data => {
      console.log(data);
    }).catch(data => {
      console.log(data);
      return this.ErrorMensajeServidor();
    }); 
  }

  async DeleteCosecha(id:any){
    this.proveedor.EliminarCosecha(id).subscribe(data => {
      console.log(data+" "+this.proveedor.status);
      this.ionViewWillEnter();
      if(this.proveedor.status){
        this.MensajeServidor();       
      }else{
        this.ErrorMensajeServidor();
      }
    })
  }

  async DeleteCosechastock(id:any){
    this.proveedor.EliminarCosechaStock(id).subscribe(data => {
      console.log(data);
    });
  }


  async ModelPresent(id:any){
    const modal = await this.modalController.create({
      component: ModalCosechaPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Cosecha':this.cosecha,
        'type':'Editar Registro',
        'id' : id,
        'accion': true,
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }

  async MensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Accion',
      message: 'La operacion se completo con exito',
      buttons: ['OK']
    });

    await alert.present();
  }

  async ErrorMensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }
}
