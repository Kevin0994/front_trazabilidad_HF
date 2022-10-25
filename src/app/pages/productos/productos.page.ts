import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ModalProductoPage } from 'src/app/modals/modal-producto/modal-producto.page';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';
import { ProviderMetodosCrud } from 'src/provider/methods/providerMetodosCrud.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  public title:any="Productos";
  public productoSemi:any=[];
  public productoFinal:any=[];
  private categoria:any;
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showButtons: boolean = true;
  private messege:any;

  categoriaSlides = {
    slidesPerView: 4,
  };


  constructor(public proveedor: ProviderService,
    private providerMensajes: ProviderMensajes,
    private providerMetodosCrud: ProviderMetodosCrud,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
  }

  CargarDatos(){
    console.log(this.showSemi);
    if(this.showSemi == true){
      this.proveedor.obtenerDocumentos('productoSemi/documents').then(data => {
        this.productoSemi=data;
        console.log(this.productoSemi);
      }).catch(data => {
        console.log(data);
      })
    }
    if(this.showFinal == true){
      this.OrdenarTabla(this.productoSemi);
        this.proveedor.obtenerDocumentos('productoFinal/documents').then(data => {
          this.productoFinal=data;
          console.log(this.productoFinal);
        }).catch(data => {
          console.log(data);
        })
    }
  }

  async registroProducto(url:string,tabla:any){
    const modal = await this.modalController.create({
      component: ModalProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'url': url,
        'type':'Nuevo Registro',
        'tabla':tabla,
      }
    });

    modal.onDidDismiss().then(data => {
      if(data.data != undefined){ //verifica si recibe el nuevo producto al cerrar el modal
        this.OrganizarDataModel(data,tabla);
      }
    })

    return await modal.present();
  }

  async editOpenModal(url:string,producto:any,tabla:any){

    const modal = await this.modalController.create({
      component: ModalProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Producto': producto,
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

  async DeleteProducto(producto:any){
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
              this.deleteDocument('productoSemi/delete/',producto.id, producto.categoriaId, this.productoSemi)
            }else{
              this.deleteDocument('productoFinal/delete/',producto.id, producto.categoriaId, this.productoFinal)
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteDocument(urlDocument:string,productoId:any,categoriaId:any,tabla:any){
    const id = productoId + '/' + categoriaId;
    this.proveedor.eliminarDocumento(urlDocument,id).subscribe(data => {
      console.log(data);
      this.providerMetodosCrud.eliminarDatosTabla(productoId,tabla);
      this.providerMensajes.MensajeDeleteServidor(this.alertController);
    },error => {
      this.messege = error;
      this.providerMensajes.ErrorMensajePersonalizado(this.alertController,this.messege.error);
    })
  }

  OrganizarDataModel(data:any,tabla:any){
    let idOld = data.data.idOld;
    let producto={ // reemplazamos el nuevo producto a una varible
      id: data.data.id,
      nombre: data.data.nombre,
      img: data.data.img,
      materiaPrima: data.data.materiaPrima,
      categoriaId: data.data.categoriaId,
      categoria: data.data.categoria,
      status: data.data.status,
    }
    console.log(producto);

    if (tabla === 'Semi'){
      this.productoSemi = this.providerMetodosCrud.actualizarDatosTabla(producto,idOld,this.productoSemi);
      this.OrdenarTabla(this.productoSemi);
      console.log('tabla producto');
      console.table(this.productoSemi);
    }else{
      this.productoFinal = this.providerMetodosCrud.actualizarDatosTabla(producto,idOld,this.productoFinal);
      this.OrdenarTabla(this.productoFinal);
      console.table(this.productoFinal);
    }

  }

  OrdenarTabla(producto:any=[]){
    producto.sort(function(a, b){ //Ordena el array de manera Descendente
      if(a.id > b.id){
          return 1
      } else if (a.id < b.id) {
          return -1
      } else {
          return 0
      }
   })
  }

}
