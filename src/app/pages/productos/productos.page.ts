import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ModalProductoSemifinalPage } from 'src/app/modals/modal-producto-semifinal/modal-producto-semifinal.page';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

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
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
    this.CargarDatos();
  }

  ionViewWillEnter(){

  }

  CargarDatos(){
    this.proveedor.obtenerDocumentos('productoSemi/documents').then(data => {
      this.productoSemi=data;
      this.OrdenarTabla(this.productoSemi);
    }).catch(data => {
      console.log(data);
    })
    this.proveedor.obtenerDocumentos('productoFinal/documents').then(data => {
      this.productoFinal=data;
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(url:string){
    const modal = await this.modalController.create({
      component: ModalProductoSemifinalPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'url': url,
        'type':'Nuevo Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      this.actualizarDatosPS(data);
    })

    return await modal.present();
  }

  async editOpenModal(url:string,producto:any){

    const modal = await this.modalController.create({
      component: ModalProductoSemifinalPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Producto': producto,
        'url': url,
        'type':'Editar Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      this.actualizarDatosPS(data);
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
              this.deleteDocument('productoSemi/delete/',producto)
            }else{
              this.deleteDocument('productoFinal/delete/',producto)
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteDocument(urlDocument:string,producto:any){
    this.proveedor.InsertarDocumento(urlDocument,producto).then(data => {
      console.log(data);
      if (this.proveedor.status) {
        this.eliminarDatosTabla(producto);
        this.CargarDatos();
        this.MensajeServidor();
      } else {
        this.ErrorMensajeServidor();
        return;
      }
    }).catch(data => {
      console.log(data);
    })
  }

  actualizarDatosPS(data:any){
    if(data.data != undefined){ //verifica si recibe el nuevo producto al cerrar el modal
      let producto={ // reemplazamos el nuevo producto a una varible 
        categoria: data.data.categoria,
        codigo: data.data.codigo,
        id: data.data.id,
        img: data.data.img,
        materiaPrima: data.data.materiaPrima,
        nombre: data.data.nombre,
        status: data.data.status,
      }
      // Verifica si hay que ingresar o editar
      if(producto.status === 'editado'){//Edita el producto de la tabla
        let foundIndex = this.productoSemi.findIndex(obj =>
          obj.id == producto.id
        );
        this.productoSemi[foundIndex] = producto;
        this.OrdenarTabla(this.productoSemi);
      }
      if(producto.status === 'nuevo'){//Inserta la nueva cosecha en la tabla
        this.CargarDatos();
      }
    }
  }

  eliminarDatosTabla(producto:any){
    let foundIndex = this.productoSemi.findIndex(obj =>
      obj.id == producto.id
    );
    this.productoSemi.splice(foundIndex,1);
  }

  OrdenarTabla(producto:any=[]){
    producto.sort(function(a, b){ //Ordena el array de manera Descendente
      if(a.categoria > b.categoria){
          return 1
      } else if (a.categoria < b.categoria) {
          return -1
      } else {
          return 0
      }
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

  async ErrorMensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'Error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

}
