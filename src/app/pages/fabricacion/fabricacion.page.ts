import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-fabricacion',
  templateUrl: './fabricacion.page.html',
  styleUrls: ['./fabricacion.page.scss'],
})
export class FabricacionPage implements OnInit {

@ViewChild('buttons') botones: ElementRef ;
@ViewChild('PageSemi') pageSemi: ElementRef ;

categorias:any=[];
productos:any=[];

  constructor(private renderer2: Renderer2,
    public proveedor: ProviderService,) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.LoadCategorias();
  }

  openPage(){
    const Botones = this.botones.nativeElement;
    const PageSemi = this.pageSemi.nativeElement;
    this.renderer2.setStyle(Botones,'display','none');
    this.renderer2.setStyle(PageSemi,'display','block');
  }

  ClosePage(){
    const Botones = this.botones.nativeElement;
    const PageSemi = this.pageSemi.nativeElement;
    this.renderer2.setStyle(PageSemi,'display','none');
    this.renderer2.setStyle(Botones,'display','block');
  }

  LoadCategorias(){
    this.proveedor.loadCategoriaProducto().then(data => {
      console.log(data);
      this.categorias=data;
    }).catch(data => {
      console.log(data);
    })
  }

  openProduct(productos:any){
    this.productos=productos;
    console.log(this.productos);
  }
}
