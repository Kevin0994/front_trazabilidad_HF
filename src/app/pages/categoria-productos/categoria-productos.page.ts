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

  ionViewWillEnter(){
    this.proveedor.obtenerDocumentos('categoriaProductoSemi/documents').then(data => {
      this.categoriaSemi=data;
      console.log(this.categoriaSemi);
      this.proveedor.obtenerDocumentos('categoriaProductoFinal/documents').then(data => {
        this.categoriaFinal=data;
        console.log(this.categoriaFinal);
      }).catch(data => {
        console.log(data);
      })
    }).catch(data => {
      console.log(data);
    })
   
  }

  /* loadDatos(url:string){
    this.proveedor.obtenerDocumentos(url).then(data => {
      if(this.showSemi == true){
        this.categoriaSemi=data;
      }else{
        this.categoriaFinal=data;
      }
    }).catch(data => {
      console.log(data);
    })
  } */

  async registroCategoria(url:string,tabla:any){
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

  async editCategoria(url:string,categoria:any,tabla:any){

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
      this.providerMensajes.MensajeDeleteServidor(this.alertController);
    },error => {
      this.messege = error;
      this.providerMensajes.ErrorMensajePersonalizado(this.alertController,this.messege.error);
    })
  }

  OrganizarDataModel(data:any,tabla:any){
    let idOld = data.data.idOld;
    let categoria={ // reemplazamos el nuevo producto a una varible
      id: data.data.id,
      nombre: data.data.nombre,
      img: data.data.img,
      nProductos: data.data.nProductos,
      status: data.data.status
    }

    if (tabla === 'Semi'){
      this.categoriaSemi = this.providerMetodosCrud.actualizarDatosTabla(categoria,idOld,this.categoriaSemi);
      this.OrdenarTabla(this.categoriaSemi);
      console.table(this.categoriaSemi);
    }else{
      this.categoriaFinal = this.providerMetodosCrud.actualizarDatosTabla(categoria,idOld,this.categoriaFinal);
      this.OrdenarTabla(this.categoriaFinal);
      console.table(this.categoriaFinal);
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
