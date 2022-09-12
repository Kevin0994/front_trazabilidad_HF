import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-modal-alimentos',
  templateUrl: './modal-alimentos.page.html',
  styleUrls: ['./modal-alimentos.page.scss'],
})
export class ModalAlimentosPage implements OnInit {

  
  @Input() Alimento: any="init";
  @Input() type: any;
  public formRegistro: FormGroup;
  private formulario:any;
  private alimento:any;

  constructor(public proveedor: ProviderService,
    public fb: FormBuilder,
    public navCtrl:NavController,
    public alertController: AlertController,
    public modalController:ModalController,) { }

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
    this.formRegistro =  this.fb.group({
      'codigo': new FormControl(this.Alimento.codigo,Validators.required),
      'nombre': new FormControl(this.Alimento.nombre,Validators.required),
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

    this.alimento = {
      codigo: this.formulario.codigo,
      nombre: this.formulario.nombre,
    }

    if(this.type == 'Nuevo Registro'){


      this.proveedor.InsertarDocumento('alimentos/post',this.alimento).then(data => {
        console.log(data);

        if(this.proveedor.status){
          this.MensajeServidor();
        }else{
          this.ErrorMensajeServidor();
          return;
        }
      }).catch(data => {
        console.log(data);
      });
    }else{


      this.proveedor.actualizarDocumento('alimentos/put/',this.Alimento.id,this.alimento).then(data => {
        console.log(data);

        if(this.proveedor.status){
          this.MensajeServidor();
        }else{
          this.ErrorMensajeServidor();
          return;
        }
      }).catch(data => {
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
