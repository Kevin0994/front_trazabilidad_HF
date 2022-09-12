import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
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
  }

  ionViewWillEnter(){
    this.proveedor.obtenerDocumentos('productoSemi/documents').then(data => {
      this.productoSemi=data;
    }).catch(data => {
      console.log(data);
    })
    this.proveedor.obtenerDocumentos('productoFinal/documents').then(data => {
      this.productoFinal=data;
    }).catch(data => {
      console.log(data);
    })
  }

}
