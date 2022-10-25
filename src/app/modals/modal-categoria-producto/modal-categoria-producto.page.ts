import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-modal-categoria-producto',
  templateUrl: './modal-categoria-producto.page.html',
  styleUrls: ['./modal-categoria-producto.page.scss'],
})
export class ModalCategoriaProductoPage implements OnInit {

  @Input() Categoria: any="init";
  @Input() url: any;
  @Input() type: any;
  public formRegistro: FormGroup;
  private formulario:any;
  private categoria:any;
  img: string = '../../../assets/icon/userLoginIcon.png';
  public base64TrimmedURL:any;
  public base64DefaultURL:any;

  constructor(public proveedor: ProviderService,
    private providerMensajes:ProviderMensajes,
    public fb: FormBuilder,
    public navCtrl:NavController,
    public alertController: AlertController,
    public modalController:ModalController,
    public sanitizer: DomSanitizer) { 
      console.table(this.Categoria);
    }

  ngOnInit() {
    if(this.type == 'Nuevo Registro'){
      this.newForm();
    }else{
      this.editForm();
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

  newForm(){
    this.formRegistro = this.fb.group({
      'codigo': new FormControl("",Validators.required),
      'nombre': new FormControl("",Validators.required),
    })
  }

  editForm(){
    this.img = this.Categoria.img;
    this.formRegistro =  this.fb.group({
      'codigo': new FormControl(this.Categoria.id,Validators.required),
      'nombre': new FormControl(this.Categoria.nombre,Validators.required),
    })
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
    this.categoria = {
      idOld: this.Categoria.id,
      id: this.formulario.codigo,
      nombre: this.formulario.nombre,
      img: this.img,
      nProductos: this.Categoria.nProductos
    }

    if(this.categoria.idOld != this.categoria.id || this.Categoria.img != this.categoria.img || this.Categoria.nombre != this.categoria.nombre){
      if(this.type == 'Nuevo Registro'){

        this.proveedor.InsertarDocumento(this.url,this.categoria).then(data => {
          console.log(data);

          if(this.proveedor.status){
            this.categoria['nProductos']=0;
            this.categoria['status']=data;
            this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.categoria);
          }else{
            this.providerMensajes.ErrorMensajeServidor(this.alertController);
            return;
          }
        }).catch(data => {
          console.log(data);
        });
      }else{

        this.proveedor.actualizarDocumento(this.url,this.Categoria.id,this.categoria).then(data => {
          console.log(data);

          if(this.proveedor.status){
            this.categoria['status']=data;
            this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.categoria);
          }else{
            this.providerMensajes.ErrorMensajeServidor(this.alertController);
            return;
          }
        }).catch(data => {
          console.log(data);
        });
      }
    }else{
      this.modalController.dismiss();
    }

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
