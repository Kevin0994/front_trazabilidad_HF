import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import {
  AlertController,
  NavController,
  ModalController,
} from '@ionic/angular';
import { ModalFabricacionPage } from '../../modals/modal-fabricacion/modal-fabricacion.page';

@Component({
  selector: 'app-fabricacion',
  templateUrl: './fabricacion.page.html',
  styleUrls: ['./fabricacion.page.scss'],
})
export class FabricacionPage implements OnInit {
  @ViewChild('buttons') botones: ElementRef;
  @ViewChild('PageSemi') pageSemi: ElementRef;
  public title: any = '';
  public showSemi: boolean = false;
  public showFinal: boolean = false;
  public showView: boolean = false;
  public showButtons: boolean = true;
  public categoriaProducto: any;
  public categoriaSemi: any = [];
  public categoriaFinal: any = [];
  public getScreenWidth: any;
  categorias: any = [];
  productos: any = [];

  categoriaSlides = {
    slidesPerView: 4,
  };

  constructor(
    public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl: NavController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    console.log('Width screen: ', this.getScreenWidth);
    if (this.getScreenWidth <= 480) {
      this.categoriaSlides.slidesPerView = 2;
    } else {
      this.categoriaSlides.slidesPerView = 4;
    }
  }

  ngAfterViewInit() {}

  @HostListener('window:resize', ['$event'])
  CargarDatos() {
    console.log(this.showSemi);
    if (this.showSemi == true) {
      if (this.categoriaSemi.length != 0) {
        this.categorias = this.categoriaSemi;
      }
      this.proveedor
        .obtenerDocumentos('categoriaProductoSemi/documents')
        .then((data) => {
          this.categoriaSemi = data;
          this.categorias = this.categoriaSemi;
        })
        .catch((data) => {
          console.log(data);
        });
    }
    if (this.showFinal == true) {
      if (this.categoriaFinal.length != 0) {
        this.categorias = this.categoriaFinal;
      }
      this.proveedor
        .obtenerDocumentos('categoriaProductoFinal/documents')
        .then((data) => {
          this.categoriaFinal = data;
          this.categorias = this.categoriaFinal;
        })
        .catch((data) => {
          console.log(data);
        });
    }
  }

  openProduct(categoria: any) {
    if (this.showSemi == true) {
      this.cargarProductos(categoria, 'productoSemi/documents/');
    }
    if (this.showFinal == true) {
      this.cargarProductos(categoria, 'productoFinal/documents/');
    }
  }

  cargarProductos(categoria: any, collection: any) {
    this.proveedor
      .obtenerDocumentosPorId(collection, categoria)
      .then((data) => {
        this.productos = data;
        this.categoriaProducto = categoria;
        console.log(this.productos);
      })
      .catch((data) => {
        console.log(data);
      });
  }

  fabricarProducto(producto: any) {
    let refMateriaPrima;

    if(producto.materiaPrima != undefined){
      refMateriaPrima = producto.materiaPrima;
    }

    if(producto.receta != undefined){
      refMateriaPrima = producto.receta;
    }

    //Busca los documentos vinculados con l amateria prima del producto 
    this.proveedor.InsertarDocumento('alimentos/validate/get',refMateriaPrima)
        .then((data) => {
          let response = data;
          console.log(response);
          this.openModal(producto, response);
        })
        .catch((data) => {
          console.log(data);
        });
  }

  async openModal(producto: any, materiaPrima: any) {
    const modal = await this.modalController.create({
      component: ModalFabricacionPage,
      cssClass: 'modalCosecha',
      componentProps: {
        Producto: producto,
        Categoria: this.categoriaProducto,
        MateriaPrima: materiaPrima,
        showSemi: this.showSemi,
        showFinal: this.showFinal,
      },
    });

    return await modal.present();
  }

  async MensajeServidor() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'La eliminacion se completo con exito',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async ErrorMensajeServidor() {
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
