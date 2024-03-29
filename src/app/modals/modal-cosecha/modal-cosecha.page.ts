import { Component, Input, OnInit } from '@angular/core';

import { AlertController, ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

//import { cosecha } from 'src/app/models/cosecha.interface';


@Component({
  selector: 'app-modal-cosecha',
  templateUrl: './modal-cosecha.page.html',
  styleUrls: ['./modal-cosecha.page.scss'],
})
export class ModalCosechaPage implements OnInit {


  formRegistro: FormGroup;
  public nombreCosecha: string;
  private codigoCosecha: string;
  public selectedItem:any=[];
  private formulario: any;
  private cosecha: any;
  private historial: any=[];
  public lista: any;
  private fechaHis: any;


  constructor(public proveedor: ProviderService,
    private providerMensajes:ProviderMensajes,
    public fb: FormBuilder,
    public navCtrl: NavController,
    public alertController: AlertController,
    public modalController: ModalController,) {

  }

  ngOnInit() {

    this.newForm();

  }

  ionViewWillEnter() {
    this.providerMensajes.showLoading();
    this.proveedor.obtenerDocumentos('alimentos/documents').then(data => {
      this.lista = data;
      this.OrdenarTabla(this.lista);
      this.providerMensajes.dismissLoading();
    }).catch(data => {
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajeServidor();
      console.log(data);
    })
  }


  closeModal() {
    this.modalController.dismiss();
  }


  newForm() {
    this.formRegistro = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'codigo': new FormControl("", Validators.required),
      'peso': new FormControl("", Validators.required),
    })
  }


  handleChange(ev) {
    this.formulario = this.formRegistro.value;
    this.nombreCosecha = ev.detail.value.nombre;
    this.codigoCosecha = ev.detail.value.codigo;
    this.formRegistro.controls.codigo.setValue(this.codigoCosecha);
    this.formRegistro.controls.codigo.disable();
    console.log(this.formRegistro);
  }


  async Registro() {
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

    this.saveProfile();

  }

  async saveProfile() {
    await this.providerMensajes.showLoading();
    this.formulario = this.formRegistro.value;
    let loteMes = new Date().getMonth() + 1;
    let loteCalculado = this.proveedor.calcularLote();
    //let loteCalculado = 12;

    const hist={
      ingreso: this.formulario.peso * 1000,
      fecha: new Date(),
      responsable: localStorage.getItem('Usuario'),
    }

    this.historial.push(hist);

    this.cosecha = {
      nombreN: this.nombreCosecha,
      codigo: this.codigoCosecha,
      loteN: loteCalculado,
      loteMes: loteMes,
      stockN: this.formulario.peso * 1000,
      historial: this.historial,
    }

    console.table(this.cosecha);

    this.proveedor.InsertarCosecha('cosechas/post/',this.nombreCosecha, loteMes, this.cosecha).then(data => {
      console.log(data);
        if (this.proveedor.status) {
          this.cosecha['status']=data;
          this.providerMensajes.dismissLoading();
          this.providerMensajes.MensajeModalServidor(this.modalController,this.cosecha);
        } else {
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajeServidor();
        }
    }).catch(data => {
      this.providerMensajes.dismissLoading();
      this.providerMensajes.ErrorMensajeServidor();
      console.log(data);
    });
  }

  OrdenarTabla(lista:any=[]){

    lista.sort(function(a, b){ //Ordena el array de manera Descendente
      
      if(a.nombre > b.nombre){
          return 1
      } else if (a.nombre < b.nombre) {
          return -1
      } else {
          return 0
      }
    })
  }

}
