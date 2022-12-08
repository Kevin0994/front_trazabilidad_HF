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

  public title:any="Productos"; //titulo de la pagina
  public productoSemi:any=[]; //Lista de array que contiene los productos semifinales
  public productoFinal:any=[];//Lista de array que contiene los productos finales
  public productosTabla:any; //Lista que muestra en la tabla los productos que el usuario elijio mostrar
  public showSemi: boolean = false;  //variable que representa a los productos semifinales
  public showFinal: boolean = false; //variable que representa a los productos finales
  public showButtons: boolean = true; //variable que representa la activacion de los botones de seleccion del tipo de productos
  private messege:any; //variable que guarda los mensajes del servidor 

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

  ValidarSeleccion(){
    if (this.showSemi == true) { //Valida si el usuario ha seleccionado los productos semifinales
      if (this.productoSemi.length != 0) { //Valida si la lista de productos semifinales no esta vacia
        this.productosTabla = this.productoSemi;
      }else{
        this.productosTabla = null;
      }
      this.CargarDatos('productoSemi/documents');
    }
    if (this.showFinal == true) { //Valida si el usuario ha seleccionado los productos finales
      if (this.productoFinal.length != 0) { //Valida si la lista de productos semifinales no esta vacia
        this.productosTabla = this.productoFinal;
      }else{
        this.productosTabla = null;
      }
      this.CargarDatos('productoFinal/documents');
    }
  }

  CargarDatos(url:any) {

    this.proveedor
      .obtenerDocumentos(url)
      .then((data) => {
        this.productosTabla = data;
        if(this.showSemi){
          this.productoSemi = data;
        }

        if(this.showFinal){
          this.productoFinal = data;
        }
        console.log( this.productosTabla);
      })
      .catch((data) => {
        console.log(data);
      });

  }

  validateDataPost(){
    let datos = Array();

    if (this.showSemi == true) {
      datos['url'] = 'productoSemi/post/';
      datos['tabla'] = 'Semi';

      return datos;
    }

    if(this.showFinal == true){
      datos['url'] = 'productoFinal/post/';
      datos['tabla'] = 'Final';

      return datos;
    }
  }

  registroProducto(){

    let producto = this.validateDataPost();

    if (this.showSemi == true) {
      return this.registroProductoModal(producto['url'],producto['tabla']);
    }

    if(this.showFinal == true){

      return this.registroProductoModal(producto['url'],producto['tabla']);
    }
  }


  async registroProductoModal(url:string,tabla:any){
    const modal = await this.modalController.create({
      component: ModalProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'url': url,
        'type':'Nuevo Registro',
        'post':true,
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

  validateDataPut(){
    let datos = Array();

    if (this.showSemi == true) {
      datos['url'] = 'productoSemi/put/';
      datos['tabla'] = 'Semi';

      return datos;
    }

    if(this.showFinal == true){
      datos['url'] = 'productoFinal/put/';
      datos['tabla'] = 'Final';

      return datos;
    }
  }

  editCategoria(producto:any){

    let datos = this.validateDataPut();

    if (this.showSemi == true) {

      return this.editOpenModal(datos['url'] ,producto ,datos['tabla']);
    }

    if(this.showFinal == true){

      return this.editOpenModal(datos['url'] ,producto ,datos['tabla']);
    }
  }

  async editOpenModal(url:string,producto:any,tabla:any){

    const modal = await this.modalController.create({
      component: ModalProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Producto': producto,
        'url': url,
        'type':'Editar Registro',
        'post':false,
        'tabla': tabla,
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
      this.productosTabla = this.providerMetodosCrud.eliminarDatosTabla(productoId,tabla);
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
      this.productosTabla = this.productoSemi;
      this.OrdenarTabla(this.productosTabla);
      console.log('tabla producto');
      console.table(this.productosTabla);
    }else{
      this.productoFinal = this.providerMetodosCrud.actualizarDatosTabla(producto,idOld,this.productoFinal);
      this.productosTabla = this.productoFinal;
      this.OrdenarTabla(this.productoFinal);
      console.log('tabla productoFinal');
      console.table(this.productosTabla);
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
