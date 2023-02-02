import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';
import { ProviderMetodosCrud } from 'src/provider/methods/providerMetodosCrud.service';
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
  public categoriaTabla:any=[];
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showButtons: boolean = true;
  private messege:any;

  categoriaSlides = {
    slidesPerView: 4,
  };

  constructor(public proveedor: ProviderService,
    private providerMetodosCrud: ProviderMetodosCrud,
    private providerMensajes:ProviderMensajes,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
  
  }

  async CargarDatos() {

    await this.providerMensajes.showLoading();
    if (this.showSemi == true) {
      if (this.categoriaSemi.length != 0) {
        this.categoriaTabla = this.categoriaSemi;
      }else{
        this.categoriaTabla = null;
      }
      this.proveedor
        .obtenerDocumentos('categoriaProductoSemi/documents')
        .then((data) => {
          if(this.proveedor.status){
            this.categoriaSemi = data;
            this.categoriaTabla = this.categoriaSemi;
            this.providerMensajes.dismissLoading();

          }
        })
        .catch((data) => {
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajeServidor();
          console.log(data);
        });
    }
    if (this.showFinal == true) {
      if (this.categoriaFinal.length != 0) {
        this.categoriaTabla = this.categoriaFinal;
      }else{
        this.categoriaTabla = null;
      }
      this.proveedor
        .obtenerDocumentos('categoriaProductoFinal/documents')
        .then((data) => {
          this.categoriaFinal = data;
          this.categoriaTabla = this.categoriaFinal;
          this.providerMensajes.dismissLoading();

        })
        .catch((data) => {

          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajeServidor();
          console.log(data);
        });
    }
  }

  validateDataPost(){
    let datos = Array();

    if (this.showSemi == true) {
      datos['url'] = 'categoriaProductoSemi/post';
      datos['tabla'] = 'Semi';

      return datos;
    }

    if(this.showFinal == true){
      datos['url'] = 'categoriaProductoFinal/post';
      datos['tabla'] = 'Final';

      return datos;
    }
  }

  registroCategoria(){

    let categoria = this.validateDataPost();

    if (this.showSemi == true) {
      return this.registroCategoriaModal(categoria['url'],categoria['tabla']);
    }

    if(this.showFinal == true){

      return this.registroCategoriaModal(categoria['url'],categoria['tabla']);
    }
  }

  async registroCategoriaModal(url:string,tabla:any){

    const modal = await this.modalController.create({
      component: ModalCategoriaProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'url': url,
        'type':'Nuevo Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      if(data.data != undefined){ //verifica si recibe el nuevo producto al cerrar el modal
        this.OrganizarDataModel(data,tabla);
      }
    })

    return await modal.present();
  }

  validateDataPut(){
    let datos = Array();

    if (this.showSemi == true) {
      datos['url'] = 'categoriaProductoSemi/put/';
      datos['tabla'] = 'Semi';

      return datos;
    }

    if(this.showFinal == true){
      datos['url'] = 'categoriaProductoFinal/put/';
      datos['tabla'] = 'Final';

      return datos;
    }
  }

  editCategoria(categoria:any){

    let datos = this.validateDataPut();

    if (this.showSemi == true) {

      return this.editCategoriaModal(datos['url'] ,categoria ,datos['tabla']);
    }

    if(this.showFinal == true){

      return this.editCategoriaModal(datos['url'] ,categoria ,datos['tabla']);
    }
  }


  async editCategoriaModal(url:string,categoria:any,tabla:any){

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
      if(data.data != undefined){ //verifica si recibe el nuevo producto al cerrar el modal
        this.OrganizarDataModel(data,tabla);
      }
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
            this.providerMensajes.showLoading();
            if(this.showSemi == true){
              this.deleteDocument('categoriaProductoSemi/delete/',id ,this.categoriaSemi)
            }else{
              this.deleteDocument('categoriaProductoFinal/delete/',id,this.categoriaFinal)
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteDocument(urlDocument:string,id:any,tabla:any){
    this.proveedor.eliminarDocumento(urlDocument,id).subscribe(data => {
      console.log(data);
      tabla = this.providerMetodosCrud.eliminarDatosTabla(id,tabla);
      this.categoriaTabla = tabla;
      this.providerMensajes.dismissLoading();
      this.providerMensajes.MensajeDeleteServidor();
    },error => {
      this.messege = error;
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajePersonalizado(this.messege.error);
    })
  }

  OrganizarDataModel(data:any,tabla:any){
    let categoria={ // reemplazamos el nuevo producto a una varible
      id: data.data.id,
      nombre: data.data.nombre,
      img: data.data.img,
      nProductos: data.data.nProductos,
      status: data.data.status
    }

    if (tabla === 'Semi'){
      this.categoriaSemi = this.providerMetodosCrud.actualizarDatosTabla(categoria,categoria.id,this.categoriaSemi);
      this.categoriaTabla = this.categoriaSemi;
      this.OrdenarTabla(this.categoriaTabla);
      console.table(this.categoriaTabla);
    }else{
      this.categoriaFinal = this.providerMetodosCrud.actualizarDatosTabla(categoria,categoria.id,this.categoriaFinal);
      this.categoriaTabla = this.categoriaFinal;
      this.OrdenarTabla(this.categoriaTabla);
      console.table(this.categoriaTabla);
    }

  }

  OrdenarTabla(producto:any=[]){
    producto.sort(function(a, b){ //Ordena el array de manera Descendente
      if(a.nombre > b.nombre){
          return 1
      } else if (a.nombre < b.nombre) {
          return -1
      } else {
          return 0
      }
   })
  }
}
