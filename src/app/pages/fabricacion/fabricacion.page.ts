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
  public showSemi: boolean = false;
  public showButtons: boolean = true;
  public categoriaProducto:any;
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
    this.LoadCategorias();
  }


  LoadCategorias(){
    this.proveedor.obtenerDocumentos('categoriaProductoSemi/documents').then(data => {
      this.categorias=data;
    }).catch(data => {
      console.log(data);
    });
  }

  openProduct(productos:any,categoria:any){
    this.productos=productos;
    console.table(categoria);
    this.categoriaProducto=categoria;
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
