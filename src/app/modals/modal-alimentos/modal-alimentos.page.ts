import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

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

  constructor(private proveedor: ProviderService,
    private providerMensajes: ProviderMensajes,
    public fb: FormBuilder,
    private navCtrl:NavController,
    private alertController: AlertController,
    private modalController:ModalController,) { }

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
      'codigo': new FormControl(this.Alimento.id,Validators.required),
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
      idOld: this.Alimento.id,
      id: this.formulario.codigo,
      nombre: this.formulario.nombre,
    }

    if(this.Alimento.id != this.alimento.id || this.Alimento.nombre != this.alimento.nombre){

    if(this.type == 'Nuevo Registro'){

      this.proveedor.InsertarDocumento('alimentos/post',this.alimento).then(data => {
        console.log(data);

        if(this.proveedor.status){
          this.alimento['status']=data;
          this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.alimento);
        }else{
          this.providerMensajes.ErrorMensajeServidor(this.alertController);
          return;
        }
      }).catch(data => {
        console.log(data);
      });
    }else{

      this.proveedor.actualizarDocumento('alimentos/put/',this.Alimento.id,this.alimento).then(data => {
        console.log(data);

        if(this.proveedor.status){
          this.alimento['status']=data;
          this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.alimento);
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
}
