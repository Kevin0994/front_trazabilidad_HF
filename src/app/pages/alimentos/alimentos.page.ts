import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMetodosCrud } from 'src/provider/methods/providerMetodosCrud.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';
import { ModalAlimentosPage } from '../../modals/modal-alimentos/modal-alimentos.page'

@Component({
  selector: 'app-alimentos',
  templateUrl: './alimentos.page.html',
  styleUrls: ['./alimentos.page.scss'],
})
export class AlimentosPage implements OnInit {

  alimentos:any=[];
  alimento:any;

  constructor(public proveedor: ProviderService,
    private providerMetodosCrud: ProviderMetodosCrud,
    private providerMensajes:ProviderMensajes,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
  } 

  ionViewWillEnter(){
    this.loadDatos();
  }

  async loadDatos(){
    await this.providerMensajes.showLoading();
    this.proveedor.obtenerDocumentos('alimentos/documents').then(data => {
      if (this.proveedor.status) {
        this.alimentos=data;
        this.providerMensajes.dismissLoading();
      }
    }).catch(data => {
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajeServidor();
      console.log(data);
    })
  }

  async registerOpenModal(){
    const modal = await this.modalController.create({
      component: ModalAlimentosPage,
      cssClass: 'modalAlimento',
      componentProps:{
        'type':'Nuevo Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      if(data.data != undefined){ //verifica si recibe el nuevo producto al cerrar el modal
        this.OrganizarDataModel(data);
      }
    })

    return await modal.present();
  }

  async ModelPresentEdit(alimento:any){
    const modal = await this.modalController.create({
      component: ModalAlimentosPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Alimento': alimento,
        'type':'Editar Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      if(data.data != undefined){ //verifica si recibe el nuevo producto al cerrar el modal
        this.OrganizarDataModel(data);
      }
    })

    return await modal.present();
  }

  async deleteAlimento(id:any){
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

            this.providerMensajes.showLoading();
            this.deleteDocument('alimentos/delete/',id ,this.alimentos)

          }
        }
      ]
    });

    await alert.present();
  }

  OrganizarDataModel(data:any){
    let idOld = data.data.idOld;
    this.alimento={ // reemplazamos el nuevo producto a una varible
      id: data.data.id,
      nombre: data.data.nombre,
      status: data.data.status
    }
    console.table(this.alimento);

    this.alimentos = this.providerMetodosCrud.actualizarDatosTabla(this.alimento,idOld,this.alimentos);
    this.OrdenarTabla();
    console.table(this.alimentos);
  }

  OrdenarTabla(){
    this.alimentos.sort(function(a, b){ //Ordena el array de manera Descendente
      if(a.nombre > b.nombre){
          return 1
      } else if (a.nombre < b.nombre) {
          return -1
      } else {
          return 0
      }
   })
  }

  deleteDocument(urlDocument:string,id:any,tabla:any){
    this.proveedor.eliminarDocumento(urlDocument,id).subscribe(data => {
      console.log(data);
      tabla = this.providerMetodosCrud.eliminarDatosTabla(id,tabla);
      this.providerMensajes.dismissLoading();
      this.providerMensajes.MensajeDeleteServidor();
    },error => {
      let messege = error;
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajePersonalizado(messege.error);
    })
  }


}
