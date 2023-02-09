import { Component, Input ,OnInit } from '@angular/core';

import { AlertController, ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.page.html',
  styleUrls: ['./modal-usuario.page.scss'],
})
export class ModalUsuarioPage implements OnInit {

  @Input() Usuario: any="init";
  @Input() type: any;
  public formRegistro: FormGroup;
  private formulario:any;
  private usuario:any;
  public nombreRol:any;
  public lista: any;

  constructor(public proveedor: ProviderService,
    private providerMensajes:ProviderMensajes,
    public fb: FormBuilder,
    public navCtrl:NavController,
    public alertController: AlertController,
    public modalController:ModalController,) { 

    }

  ngOnInit() {
    if(this.type == 'Nuevo Registro'){
      this.newForm();
    }else{
      this.nombreRol=this.Usuario.rol
      this.editForm();
    }
  }

  ionViewWillEnter() {
    this.proveedor.obtenerDocumentos('listaRoles/documents').then(data => {
      this.lista = data;
      console.log( this.Usuario);
    }).catch(data => {
      console.log(data);
    })
  }


  closeModal(){
    this.modalController.dismiss();
  }


  newForm(){
    this.formRegistro = this.fb.group({
      'nombres': new FormControl("",Validators.required),
      'apellidos': new FormControl("",Validators.required),
      'email': new FormControl("",Validators.required),
      'userName': new FormControl("",Validators.required),
      'rol': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required),
    })
  }

  editForm(){
    this.formRegistro =  this.fb.group({
      'nombres': new FormControl(this.Usuario.nombres,Validators.required),
      'apellidos': new FormControl(this.Usuario.apellidos,Validators.required),
      'email': new FormControl(this.Usuario.email,Validators.required),
      'userName': new FormControl(this.Usuario.userName,Validators.required),
      'rol': new FormControl(this.Usuario.rol,Validators.required),
      'password': new FormControl(this.Usuario.password,Validators.required),
    })
    this.nombreRol = this.Usuario.rol;
  }


  handleChange(ev) {
    this.nombreRol = ev.detail.value;
  }

  async saveProfile(){
    this.providerMensajes.showLoading();
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

    this.usuario = {
      nombres: this.formulario.nombres,
      apellidos: this.formulario.apellidos,
      email: this.formulario.email,
      userName: this.formulario.userName,
      rol: this.nombreRol,
      password: this.formulario.password,
    }

    if(this.type == 'Nuevo Registro'){

      this.proveedor.InsertarDocumento('usuario/post',this.usuario).then(data => {
        console.log(data);

        if(this.proveedor.status){
          this.providerMensajes.dismissLoading();
          this.MensajeServidor();
        }else{
          this.providerMensajes.dismissLoading();
          this.ErrorMensajeServidor();
          return;
        }
      }).catch(data => {
        this.providerMensajes.dismissLoading();
        console.log(data);
      });
    }else{


      this.proveedor.actualizarDocumento('usuario/documents/',this.Usuario.id,this.usuario).then(data => {
        console.log(data);

        if(this.proveedor.status){
          this.providerMensajes.dismissLoading();
          this.MensajeServidor();
        }else{
          this.providerMensajes.dismissLoading();
          this.ErrorMensajeServidor();
          return;
        }
      }).catch(data => {
        this.providerMensajes.dismissLoading();
        console.log(data);
      });
    }
  }


  async MensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Registro',
      message: 'El registro se completo con exito',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.closeModal();
          }
        }]
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
