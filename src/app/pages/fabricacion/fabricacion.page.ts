import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-fabricacion',
  templateUrl: './fabricacion.page.html',
  styleUrls: ['./fabricacion.page.scss'],
})
export class FabricacionPage implements OnInit {
  public showSemi: boolean = false;
  public showButtons: boolean = true;

categoriaSlides = {
  slidesPerView: 3,
};
  categorias: any=[];
  productos: any=[];
  constructor(public proveedor: ProviderService,) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.LoadCategorias();
  }

  LoadCategorias(){
    this.proveedor.obtenerDocumentos('categoriaProducto/documents').then(data => {
      this.categorias=data;
    }).catch(data => {
      console.log(data);
    });
  }
}
