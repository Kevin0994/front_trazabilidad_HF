import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.page.html',
  styleUrls: ['./modal-producto.page.scss'],
})
export class ModalProductoPage implements OnInit {

  @Input() Producto: any="init";
  @Input() url: any;
  @Input() type: any;
  @Input() tabla: any;

  public formRegistro: FormGroup;
  private formulario:any;
  public listaCategorias:any;
  public categoria:any={
    id:'',
    nombre: '',
  };
  private producto:any;
  public listaMateriaPrima:any=[];
  public materiaPrima:any={
    id:'',
    nombre: '',
  };
  img: string = '../../../assets/icon/userLoginIcon.png';
  public base64TrimmedURL:any;
  public base64DefaultURL:any;

  constructor(public proveedor: ProviderService,
    private providerMensajes:ProviderMensajes,
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
    if(this.tabla === 'Semi'){

      this.proveedor.obtenerDocumentos('categoriaProductoSemi/documents').then(data => {
        this.listaCategorias = data;
        console.log(this.listaCategorias);
        this.proveedor.obtenerDocumentos('alimentos/documents').then(data => {
          this.listaMateriaPrima = data;
          if(this.type != 'Nuevo Registro'){
            this.materiaPrima = {
              id: this.Producto.materiaPrima,
              nombre: this.listaMateriaPrima.filter((alimento) => alimento.id === this.Producto.materiaPrima)[0].nombre
            }
            this.categoria ={
              id: this.Producto.id,
              nombre: this.Producto.categoria
            }
          }
        }).catch(data => {
          console.log(data);
        })
      }).catch(data => {
        console.log(data);
      })

  }

  if(this.tabla === 'Final'){
    this.proveedor.obtenerDocumentos('categoriaProductoFinal/documents').then(data => {
      this.listaCategorias = data;
      console.log(this.listaCategorias);
      this.proveedor.obtenerDocumentos('productoSemi/documents').then(data => {
        this.listaMateriaPrima = data;
        console.log(this.listaMateriaPrima);
        if(this.type != 'Nuevo Registro'){
          this.materiaPrima = {
            id: this.Producto.materiaPrima.producto,
            categoria: this.Producto.materiaPrima.categoria,
            nombre: this.listaMateriaPrima.filter((alimento) => alimento.id === this.Producto.materiaPrima.producto)[0].nombre
          }
          this.categoria ={
            id: this.Producto.id,
            nombre: this.Producto.categoria
          }
        }
      }).catch(data => {
        console.log(data);
      })
    }).catch(data => {
      console.log(data);
    })

  }

  }

  handleChangeCategoria(ev) {
    this.categoria = {
      id: ev.detail.value,
      nombre:  this.listaCategorias.filter(doc => doc.id == ev.detail.value)[0].nombre
    }
  }

  handleChangeAlimento(ev) {
    if(this.tabla === 'Semi'){
      this.materiaPrima = {
        id: ev.detail.value,
        nombre:  this.listaMateriaPrima.filter((alimento) => alimento.id === ev.detail.value)[0].nombre
      }
    }
    if(this.tabla === 'Final'){
      this.materiaPrima = {
        id: ev.detail.value,
        categoria: this.listaMateriaPrima.filter((alimento) => alimento.id === ev.detail.value)[0].categoriaId,
        nombre:  this.listaMateriaPrima.filter((alimento) => alimento.id === ev.detail.value)[0].nombre
      }
    }
    console.log(this.materiaPrima);
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
      'categoria': new FormControl(this.Producto.categoriaId,Validators.required),
      'codigo': new FormControl(this.Producto.id,Validators.required),
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
    let reference;
    if(this.tabla === 'Semi'){
      reference = this.materiaPrima.id
    }
    if(this.tabla === 'Final'){
      reference = this.materiaPrima
    }

    this.producto = {
      id: this.formulario.codigo,
      nombre: this.formulario.nombre,
      img: this.img,
      materiaPrima: reference,
      categoriaId: this.categoria.id,
    }

    if(this.type == 'Nuevo Registro'){

      console.log(this.producto);
      this.proveedor.InsertarDocumento(this.url,this.producto).then(data => {
        let datos:any = data;
        if(this.proveedor.status){
          this.producto['categoria']=this.categoria.nombre;
          this.producto['status']=data;
          this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.producto);
        }else{
          console.table(datos);
          this.providerMensajes.ErrorMensajePersonalizado(this.alertController,datos.error);
          return;
        }
      }).catch(data => {
        console.log(data);
        this.providerMensajes.ErrorMensajePersonalizado(this.alertController,data.error);

      });
    }else{
      this.producto = {
        idOld: this.Producto.id,
        id: this.formulario.codigo,
        nombre: this.formulario.nombre,
        img: this.img,
        materiaPrima: this.materiaPrima.id,
        categoriaId: this.categoria.id,
        categoriaIdOld: this.Producto.categoriaId,
      }

      if(this.Producto.categoria == this.categoria.nombre &&
        this.Producto.id == this.producto.id &&
        this.Producto.img == this.producto.img &&
        this.Producto.materiaPrima == this.producto.materiaPrima &&
        this.Producto.nombre == this.producto.nombre){
          this.closeModal();
      }else{
        this.proveedor.actualizarDocumento(this.url,this.producto.idOld,this.producto).then(data => {
          console.log(data);
          if(this.proveedor.status){
            this.producto['categoria']=this.categoria.nombre;
            this.producto['status']=data;
            this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.producto);
          }else{
            this.providerMensajes.ErrorMensajeServidor(this.alertController);
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
