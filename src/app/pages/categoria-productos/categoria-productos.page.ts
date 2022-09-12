import { Component, OnInit, ɵgetUnknownPropertyStrictMode } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ModalCategoriaProductoPage } from '../../modals/modal-categoria-producto/modal-categoria-producto.page'

@Component({
  selector: 'app-categoria-productos',
  templateUrl: './categoria-productos.page.html',
  styleUrls: ['./categoria-productos.page.scss'],
})
export class CategoriaProductosPage implements OnInit {

  public title:any="Categoria de Productos";
  public categoriaSemi:any=[];
  public categoriaFinal:any=[];
  private categoria:any;
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showButtons: boolean = true;
  private messege:any;

  categoriaSlides = {
    slidesPerView: 4,
  };

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.proveedor.obtenerDocumentos('categoriaProductoSemi/documents').then(data => {
      this.categoriaSemi=data;
    }).catch(data => {
      console.log(data);
    })
    this.proveedor.obtenerDocumentos('categoriaProductoFinal/documents').then(data => {
      this.categoriaFinal=data;
    }).catch(data => {
      console.log(data);
    })
  }

  loadDatos(url:string){
    this.proveedor.obtenerDocumentos(url).then(data => {
      if(this.showSemi == true){
        this.categoriaSemi=data;
      }else{
        this.categoriaFinal=data;
      }
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(url:string){
    const modal = await this.modalController.create({
      component: ModalCategoriaProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'url': url,
        'type':'Nuevo Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }

  async editOpenModal(url:string,categoria:any){

    const modal = await this.modalController.create({
      component: ModalCategoriaProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Categoria':categoria,
        'url': url,
        'type':'Editar Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }

  async DeleteCategoria(id:any){
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
            if(this.showSemi == true){
              this.deleteDocument('categoriaProductoSemi/delete/',id,'categoriaProductoSemi/documents')
            }else{
              this.deleteDocument('categoriaProductoFinal/delete/',id,'categoriaProductoFinal/documents')
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteDocument(urlDocument:string,id:any,urlDatos:string){
    this.proveedor.eliminarDocumento(urlDocument,id).subscribe(data => {
      console.log(urlDatos);
      this.loadDatos(urlDatos);
      this.MensajeServidor();
    },error => {
      this.messege = error;
      this.ErrorMensajeServidor(this.messege.error);
    })
  }

  async MensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'La eliminacion se completo con exito',
      buttons: ['OK']
    });

    await alert.present();
  }

  async ErrorMensajeServidor(cadena:string){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: cadena,
      buttons: ['OK']
    });

    await alert.present();
  }

}
