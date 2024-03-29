import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController, NavController } from '@ionic/angular';
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
  public img: any;
  public imgURL: any = 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000';
  public imgCapture: any = false;
  public base64TrimmedURL:any;
  public base64DefaultURL:any;

  constructor(
    public proveedor: ProviderService,
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
    this.img ={
      url: 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000',
      name: 'imagenExample',
    }
    this.formRegistro = this.fb.group({
      'nombre': new FormControl("",Validators.required),
    })
  }

  editForm(){
    this.imgURL = this.Categoria.img.url;
    this.img = this.Categoria.img;
    this.formRegistro =  this.fb.group({
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

    await this.providerMensajes.showLoading();

    this.categoria = {
      nombre: this.formulario.nombre,
      img: this.img,
      status: this.imgCapture,
    }

    console.table(this.categoria);

    if(this.Categoria.img != this.categoria.img || this.Categoria.nombre != this.categoria.nombre){
      if(this.type == 'Nuevo Registro'){

        this.proveedor.InsertarDocumento(this.url,this.categoria).then(data => {
          console.table(data);
          let response = data as any;
          if(this.proveedor.status){

            this.categoria['nProductos']=0;
            this.categoria['status']=response.status;
            this.categoria['id']=response.id;

            if(this.imgCapture){
              this.categoria['img']=response.img;
            }
            this.providerMensajes.dismissLoading();
            this.providerMensajes.MensajeModalServidor(this.modalController,this.categoria);
          }else{
            this.providerMensajes.dismissLoading();
            if(response.error.message != undefined){
              this.providerMensajes.ErrorMensajePersonalizado(response.error.message);
            }else{
              this.providerMensajes.ErrorMensajeServidor();
            }
            return;
          }
        }).catch(data => {
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajeServidor();
          console.log(data);
        });
      }else{

        this.categoria['oldNombre']=this.Categoria.nombre;

        if(this.imgCapture){
          this.categoria.img['imgOld'] = this.Categoria.img;
        }
        this.proveedor.actualizarDocumento(this.url,this.Categoria.id,this.categoria).then(data => {
          console.log(data);
          let response = data as any;

          if(this.proveedor.status){
            this.categoria['status']=response.status;
            this.categoria['img']=response.img;
            this.categoria['id']=this.Categoria.id;
            this.categoria['nProductos']=this.Categoria.nProductos;
            this.providerMensajes.dismissLoading();
            this.providerMensajes.MensajeModalServidor(this.modalController,this.categoria);
          }else{
            this.providerMensajes.dismissLoading();
            if(response.error.message != undefined){
              this.providerMensajes.ErrorMensajePersonalizado(response.error.message);
            }else{
              this.providerMensajes.ErrorMensajeServidor();
            }
            return;
          }
        }).catch(data => {
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajeServidor();
          console.log(data);
        });
      }
    }else{
      this.providerMensajes.dismissLoading();
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
    let imageFile = event.target.files[0];
    this.extraerBase64(imageFile).then((imagen:any) => {
      this.imgURL = imagen.base; 
      this.img = {
        base: imagen.base,
        name: imageFile.name,
        type: imageFile.type,
      }
      this.imgCapture = true;
    })
  }

}
