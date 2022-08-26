import { Component, Input ,OnInit } from '@angular/core';
import { FormBuilder,  FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-modal-fabricacion',
  templateUrl: './modal-fabricacion.page.html',
  styleUrls: ['./modal-fabricacion.page.scss'],
})
export class ModalFabricacionPage implements OnInit {

  @Input() Producto: any="init";
  @Input() Categoria: any;
  @Input() MateriaPrima: any;
  public formRegistro: FormGroup;
  private formulario:any;
  private loteMateriaPrima:any;
  private productoSemifinal:any;

  constructor(public proveedor: ProviderService,
    private fb: FormBuilder,
    private navCtrl:NavController,
    private alertController: AlertController,
    private modalController:ModalController,) { }

  ngOnInit() {
    this.newForm();
  }

  ionViewWillEnter() {
    
  }

  

  closeModal(){
    this.modalController.dismiss();
  }

  async saveProfile(){
    this.formulario = this.formRegistro.value;
    if (this.formRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    var peticion = {
      ingreso : this.formulario.pesoMateriaPrima
    }

    this.proveedor.actualizarDocumento('stock/',this.MateriaPrima.nombre,peticion).then(data => {
      this.loteMateriaPrima = data;
      if(this.proveedor.status){

        this.productoSemifinal = {
          nombre_mp: this.MateriaPrima.nombre, //nombre matria prima
          nombre_ps: this.Producto.nombre, //nombre producto semifinal
          lote_mp: this.loteMateriaPrima, //lote materia prima
          lote_ps: new Date(this.formulario.fecha).getMonth() + 1, //lote producto semifinal
          peso_mp: this.formulario.pesoMateriaPrima, //peso materia prima
          n_proceso: 1, //numero de proceso
          fechaEntrada: new Date().toLocaleString(),
          fechaSalida: 'na',
          n_fundas: this.formulario.fundas, //numero de fundas
          peso_ps: this.formulario.pesoFinal, //peso producto semifinal
          conversion: 'conversion',
          responsable: localStorage.getItem('Usuario'),
          estado: 'En proceso',
        }

        console.table(this.productoSemifinal);
        console.table(this.loteMateriaPrima);

        this.proveedor.InsertarDocumento('productoSemi/post',this.productoSemifinal).then(data => {
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
        this.ErrorMensajeServidor();
        return;
      }
    }).catch(data => {
      console.log(data);
    });

  }



  newForm(){
    this.formRegistro = this.fb.group({
      'nombre': new FormControl(this.Producto.nombre,Validators.required),
      'materiaPrima': new FormControl(this.MateriaPrima.nombre,Validators.required),
      'pesoMateriaPrima': new FormControl("",Validators.required),
      'fundas': new FormControl("",Validators.required),
      'pesoFinal': new FormControl("",Validators.required),
    })
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
