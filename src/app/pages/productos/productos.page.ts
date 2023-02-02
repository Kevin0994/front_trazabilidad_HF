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
  temp: any = [];

  categoriaSlides = {
    slidesPerView: 4,
  };


  constructor(
    public proveedor: ProviderService,
    private providerMensajes: ProviderMensajes,
    private providerMetodosCrud: ProviderMetodosCrud,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
  }

  async ValidarSeleccion(){
    await this.providerMensajes.showLoading();
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
        this.providerMensajes.dismissLoading();
        this.productosTabla = data;
        this.temp = data;
        if(this.showSemi){
          this.productoSemi = data;
        }

        if(this.showFinal){
          this.productoFinal = data;
        }
      })
      .catch((data) => {
        this.providerMensajes.dismissLoading();
        this.providerMensajes.ErrorMensajeServidor();
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

    this.providerMensajes.showLoading();

    let producto = this.validateDataPost();
    let listaMateriaPrima;

    this.proveedor.obtenerDocumentos('productos/alldocuments').then(data => {
      listaMateriaPrima = data;
      console.log(listaMateriaPrima);
      if (this.showSemi == true) {

        let materiaPrima = Array({
          id:'',
          nombre:'',
        });

        this.registroProductoModal(producto['url'],listaMateriaPrima, '' , materiaPrima , producto['tabla']);
      }

      if(this.showFinal == true){

        let receta = [{
          presentacion: '',
          materiaPrima: Array({
            id:'',
            nombre:'',
          })
        }]

        this.registroProductoModal(producto['url'],listaMateriaPrima, receta , '',producto['tabla']);
      }
    }).catch(data => {
      console.log(data);
    })

  }


  async registroProductoModal(url:string,listaMp:any,receta:any ,materiaPrima:any, tabla:any){
    this.providerMensajes.dismissLoading();
    const modal = await this.modalController.create({
      component: ModalProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'url': url,
        'receta': receta,
        'materiaPrima': materiaPrima,
        'listaMateriaPrima': listaMp,
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

  async editProducto(producto:any){

    await this.providerMensajes.showLoading();

    let datos = this.validateDataPut();

    if (this.showSemi == true) {

      this.proveedor.obtenerDocumentos('productos/alldocuments').then(data => {
        let listaMateriaPrima = data;
        let materiaPrima = this.rellenarArrayMateriaPrima(producto,listaMateriaPrima);
        console.log(materiaPrima);
        this.editOpenModal(datos['url'] ,producto, '' ,materiaPrima,listaMateriaPrima ,datos['tabla']);

      }).catch(data => {
        console.log(data);
      })
    }

    if(this.showFinal == true){
      this.proveedor.obtenerDocumentos('productos/alldocuments').then(data => {
        let listaMateriaPrima = data;
        let receta = this.rellenarArrayReceta(producto,listaMateriaPrima);
        console.log(receta);
        this.editOpenModal(datos['url'] ,producto ,receta, '',listaMateriaPrima, datos['tabla']);

      }).catch(data => {
        this.providerMensajes.dismissLoading();
        console.log(data);
      })

    }
  }

  async editOpenModal(url:string,producto:any, receta:any, materiaPrima:any , listaMp ,tabla:any){

    this.providerMensajes.dismissLoading();

    const modal = await this.modalController.create({
      component: ModalProductoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Producto': producto,
        'receta': receta,
        'materiaPrima': materiaPrima,
        'listaMateriaPrima': listaMp,
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

  rellenarArrayMateriaPrima(producto,listaMp){

    let refid;
    let mp = Array();

    producto.materiaPrima.forEach(function(doc,index) {
      if(doc.id._path.segments.length > 2){
        refid = doc.id._path.segments[3];
      }else{
        refid = doc.id._path.segments[1];
      }
      let documento;
      let mpNombre = listaMp.filter((alimento) => alimento.id == refid)
      if(mpNombre.length != 0){
        documento ={
          id: refid,
          nombre: mpNombre[0].nombre,
        }
      }else{
        documento ={
          id: '',
          nombre: '',
        }
      }
      console.log(documento);
      mp.push(documento)
    });

    return mp;

  }



  rellenarArrayReceta(producto,listaMp){

    let refid;
    let receta = Array();

    producto.receta.map(function(rec,i) {
      console.log(receta);
        receta.push({
          presentacion: rec.presentacion,
          materiaPrima: Array(),
        })
        console.log('entro');
        console.log(receta);

      rec.materiaPrima.forEach(function(doc,n){
        console.log(doc.peso);
        if(doc.id._path.segments.length > 2){
          refid = doc.id._path.segments[3];
        }else{
          refid = doc.id._path.segments[1];
        }
        console.log(listaMp);
        let documento;
        let mpNombre = listaMp.filter((alimento) => alimento.id == refid)
        if(mpNombre.length != 0){
          documento ={
            id: refid,
            nombre: mpNombre[0].nombre,
          }
        }else{
          documento ={
            id: '',
            nombre: '',
          }
        }
        receta[i].materiaPrima.push(documento)
      })
    })
    console.log('terminado')
    console.log(receta[0].materiaPrima[0]);
    return receta;
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
            this.providerMensajes.showLoading();
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
      this.providerMensajes.dismissLoading();
      this.providerMensajes.MensajeDeleteServidor();
    },error => {
      this.messege = error;
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajePersonalizado(this.messege.error);
    })
  }

  OrganizarDataModel(data:any,tabla:any){
    let producto={ // reemplazamos el nuevo producto a una varible
      id: data.data.id,
      codigo:data.data.codigo,
      nombre: data.data.nombre,
      img: data.data.img,
      categoriaId: data.data.categoriaId,
      categoria: data.data.categoria,
      status: data.data.status,
    }
    console.log(producto);

    if (tabla === 'Semi'){
      producto['materiaPrima']=data.data.materiaPrima;
      this.productoSemi = this.providerMetodosCrud.actualizarDatosTabla(producto,producto.id,this.productoSemi);
      this.productosTabla = this.productoSemi;
      this.OrdenarTabla(this.productosTabla);
      console.log('tabla producto');
      console.table(this.productosTabla);
    }else{
      producto['receta']=data.data.receta;
      this.productoFinal = this.providerMetodosCrud.actualizarDatosTabla(producto,producto.id,this.productoFinal);
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.nombre.toLowerCase().indexOf(val) !== -1 || !val;
    });
    console.log(temp);
    // update the rows
    this.productosTabla = temp;
  }


}
