import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-modal-producto-semifinal',
  templateUrl: './modal-producto-semifinal.page.html',
  styleUrls: ['./modal-producto-semifinal.page.scss'],
})
export class ModalProductoSemifinalPage implements OnInit {

  @Input() Producto: any="init";
  @Input() url: any;
  @Input() type: any;

  public formRegistro: FormGroup;
  private formulario:any;
  public listaCategorias:any;
  public categoria:any={
    id:'',
    nombre: '',
  };
  private producto:any;
  public listaAlimentos:any=[];
  public materiaPrima:any={
    id:'',
    nombre: '',
  };
  img: string = '../../../assets/icon/userLoginIcon.png';
  public base64TrimmedURL:any;
  public base64DefaultURL:any;

  constructor(public proveedor: ProviderService,
    public fb: FormBuilder,
    public navCtrl:NavController,
    public alertController: AlertController,
    public modalController:ModalController,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log(this.Producto)
    if(this.type == 'Nuevo Registro'){
      this.newForm();
    }else{
      this.editForm();
    }
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos(){
    this.proveedor.obtenerDocumentos('alimentos/documents').then(data => {
      this.listaAlimentos = data;
      if(this.type != 'Nuevo Registro'){
        this.materiaPrima = {
          id: this.Producto.materiaPrima,
          nombre: this.listaAlimentos.filter((alimento) => alimento.id === this.Producto.materiaPrima)[0].nombre
        }
        this.categoria ={
          id: this.Producto.id,
          nombre: this.Producto.categoria
        }
      }
    }).catch(data => {
      console.log(data);
    })
    this.proveedor.obtenerDocumentos('categoriaProductoSemi/documents').then(data => {
      this.listaCategorias = data;
      console.log(this.listaCategorias);
    }).catch(data => {
      console.log(data);
    })
  }

  handleChangeCategoria(ev) {
    this.categoria = {
      id: ev.detail.value,
      nombre:  this.listaCategorias.filter(doc => doc.id == ev.detail.value)[0].nombre
    }
  }

  handleChangeAlimento(ev) {
    this.materiaPrima = {
      id: ev.detail.value,
      nombre:  this.listaAlimentos.filter((alimento) => alimento.id === ev.detail.value)[0].nombre
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

  newForm(){
    this.formRegistro = this.fb.group({
      'categoria': new FormControl("",Validators.required),
      'codigo': new FormControl("",Validators.required),
      'nombre': new FormControl("",Validators.required),
      'materiaPrima': new FormControl("",Validators.required),
    })
  }

  editForm(){
    this.img = this.Producto.img;
    this.formRegistro =  this.fb.group({
      'categoria': new FormControl(this.Producto.id,Validators.required),
      'codigo': new FormControl(this.Producto.codigo,Validators.required),
      'nombre': new FormControl(this.Producto.nombre,Validators.required),
      'materiaPrima': new FormControl(this.Producto.materiaPrima,Validators.required),
    })
    this.categoria.nombre = this.Producto.categoria;

  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
          resolve({
            blod: $event,
            image,
            base: reader.result
          });
        };
        reader.onerror = error => {
          resolve({
            blod: $event,
            image,
            base:null
          });
        };
      }catch(e){
        return null;
      }
  })

  capturarFile(event): any {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen:any) => {
      this.img= imagen.base;
    })
  }

  getImage(imageUrl: string) {
    this.getBase64ImageFromURL(imageUrl).subscribe((base64Data: string) => {
      this.base64TrimmedURL = base64Data;
    });
  }

  async saveProfile(){
    this.formulario = this.formRegistro.value;
    if(this.formRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    this.producto = {
      codigo: this.formulario.codigo,
      nombre: this.formulario.nombre,
      img: this.img,
      materiaPrima: this.materiaPrima.id,
      categoria: this.categoria.id
    }

    if(this.type == 'Nuevo Registro'){

      console.log(this.url);
      this.proveedor.InsertarDocumento(this.url,this.producto).then(data => {
        let datos:any = data;
        if(this.proveedor.status){
          console.log('status 200');
          this.producto['id']=this.categoria.id;
          this.producto['categoria']=this.categoria.nombre;
          this.producto['status']='nuevo';
          this.proveedor.MensajeServidor(this.modalController,this.alertController,this.producto);
        }else{
          this.proveedor.ErrorMensajePersonalizado(this.alertController,datos.error);
          return;
        }
      }).catch(data => {
        this.proveedor.ErrorMensajePersonalizado(this.alertController,data.error);
        console.log(data);
      });
    }else{
      this.producto = {
        producto: this.Producto,
        codigo: this.formulario.codigo,
        nombre: this.formulario.nombre,
        img: this.img,
        materiaPrima: this.materiaPrima.id,
        categoria: this.categoria.id
      }

      if(this.Producto.categoria == this.categoria.nombre &&
        this.Producto.codigo == this.producto.codigo &&
        this.Producto.img == this.producto.img &&
        this.Producto.materiaPrima == this.producto.materiaPrima &&
        this.Producto.nombre == this.producto.nombre){
          this.closeModal();
      }else{
        this.proveedor.InsertarDocumento(this.url,this.producto).then(data => {
          console.log(data);
          if(this.proveedor.status){
            this.producto['id']=this.Producto.id;
            this.producto['categoria']=this.categoria.nombre;
            this.producto['status']='editado';
            this.proveedor.MensajeServidor(this.modalController,this.alertController,this.producto);
          }else{
            this.proveedor.ErrorMensajeServidor(this.alertController);
            return;
          }
        }).catch(data => {
          console.log(data);
        });
      }
    }
  }


  /* Method to fetch image from Url */
  getBase64ImageFromURL(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  /* Method to create base64Data Url from fetched image */
  getBase64Image(img: HTMLImageElement): string {
    // We create a HTML canvas object that will create a 2d image
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    let dataURL: string = canvas.toDataURL("image/png");
    this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
}
