import { Component, Input ,OnInit } from '@angular/core';
import { FormBuilder,  FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-modal-descontar-stock',
  templateUrl: './modal-descontar-stock.page.html',
  styleUrls: ['./modal-descontar-stock.page.scss'],
})
export class ModalDescontarStockPage implements OnInit {

  @Input() ProductoId: any;
  @Input() Url: any;
  public formRegistro: FormGroup;
  private formulario:any;

  constructor(private providerMensajes:ProviderMensajes,
    public proveedor: ProviderService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private modalController:ModalController,) { 

    }

  ngOnInit() {
    this.newForm();
  }

  newForm(){
    this.formRegistro = this.fb.group({
      'peso': new FormControl("",Validators.required),
    })
  }

  closeModal(){
    this.modalController.dismiss();
  }

  async actualizarProducto(){
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
    const alert = await this.alertController.create({
      header: 'Atencion',
      message: '¿Seguro que desea retirar stock de este lote?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {
            this.providerMensajes.showLoading();
            let retiro = {
              peso: this.formulario.peso
            }

            console.table(this.ProductoId);
            this.proveedor.actualizarDocumento(this.Url,this.ProductoId,retiro).then(data => {
              console.log(data);
              let response = data as any;
              response['id']=this.ProductoId;
              if(this.proveedor.status){
                this.providerMensajes.dismissLoading();
                this.providerMensajes.MensajePersonalizadoCrud(this.modalController,response.messege,response);
              }else{
                this.providerMensajes.dismissLoading();
                this.providerMensajes.ErrorMensajePersonalizado(response.error.messege);
                return;
              }
            }).catch(data => {
              this.providerMensajes.dismissLoading();
              console.log(data);
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
