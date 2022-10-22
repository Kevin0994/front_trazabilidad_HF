import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { ModalFabricacionPage } from '../../modals/modal-fabricacion/modal-fabricacion.page'

@Component({
  selector: 'app-fabricacion',
  templateUrl: './fabricacion.page.html',
  styleUrls: ['./fabricacion.page.scss'],
})
export class FabricacionPage implements OnInit {

@ViewChild('buttons') botones: ElementRef ;
@ViewChild('PageSemi') pageSemi: ElementRef ;
  public title:any="";
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showView: boolean = false;
  public showButtons: boolean = true;
  public categoriaProducto:any;
  public categoriaSemi: any=[];
  public categoriaFinal: any=[];
  categorias: any=[];
  productos: any=[];

categoriaSlides = {
  slidesPerView: 4,
};

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
  }

  ngAfterViewInit(){

  }

  CargarDatos(){
    console.log(this.showSemi);
    if(this.showSemi == true){
      if(this.categoriaSemi.length != 0){
        this.categorias = this.categoriaSemi;
      }
      this.proveedor.obtenerDocumentos('categoriaProductoSemi/documents').then(data => {
        this.categoriaSemi = data;
        this.categorias = this.categoriaSemi;
      }).catch(data => {
        console.log(data);
      });
    }
    if(this.showFinal == true){
      if(this.categoriaFinal.length != 0){
        this.categorias = this.categoriaFinal;
      }
      this.proveedor.obtenerDocumentos('categoriaProductoFinal/documents').then(data => {
        this.categoriaFinal = data;
        this.categorias=this.categoriaFinal;
      }).catch(data => {
        console.log(data);
      });
    }
  }

  openProduct(categoria:any){
    if(this.showSemi == true){
      this.proveedor.obtenerDocumentosPorId('productoSemi/documents/',categoria).then(data => {
        this.productos=data;
        this.categoriaProducto=categoria;
      }).catch(data => {
        console.log(data);
      });
    }
    if(this.showFinal == true){
      this.proveedor.obtenerDocumentosPorId('productoFinal/documents/',categoria).then(data => {
        this.productos=data;
        this.categoriaProducto=categoria;
        console.log(this.productos);
      }).catch(data => {
        console.log(data);
      });
    }
  }

  BuscarMateriaPrima(producto:any){
    this.proveedor.obtenerDocumentosPorId('cosechas/documents/',producto.materiaPrima).then(data => {
      const materiaPrima = data;
      this.openModal(producto, materiaPrima);
    }).catch(data => {
      console.log(data);
    })
  }


  async openModal(producto:any, materiaPrima:any){
    const modal = await this.modalController.create({
      component: ModalFabricacionPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Producto': producto,
        'Categoria': this.categoriaProducto,
        'MateriaPrima': materiaPrima,
      }
    });

    return await modal.present();
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
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

}
