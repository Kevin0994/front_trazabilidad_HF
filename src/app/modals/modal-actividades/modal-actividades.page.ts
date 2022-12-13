import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-actividades',
  templateUrl: './modal-actividades.page.html',
  styleUrls: ['./modal-actividades.page.scss'],
})
export class ModalActividadesPage implements OnInit {
  @Input() type: any;
  @Input() actividad: any = {};
  form: FormGroup;
  nuevaActividad: any;

  constructor(
    private fb: FormBuilder,
    private proveedor: ProviderService,
    public alertController: AlertController,
    public modalController:ModalController,
  ) { }

  ngOnInit() {
    if(this.type === 'nuevo'){
      this.newForm();
    }else{
      this.editForm();
    }
  }

  newForm() {
    this.form = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'tipo': new FormControl("", Validators.required),
    })
  }

  editForm() {
    this.form = this.fb.group({
      'nombre': new FormControl(this.actividad.nombre, Validators.required),
      'tipo': new FormControl(this.actividad.tipo, Validators.required),
    })
  }

  closeModal(){
    this.modalController.dismiss();
  }

  async handleSubmit() {
    this.nuevaActividad = this.form.value;
    if (this.form.invalid) {
      const alert = await this.alertController.create({
        header: '¡Datos incompletos',
        message: 'Rellene todos los campos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    if(this.type === 'nuevo')
      this.proveedor.InsertarDocumento('actividades/post', this.nuevaActividad)
      .then(res => {this.modalController.dismiss()});
    else
    this.proveedor.actualizarDocumento('actividades/documents/', this.actividad.id, this.nuevaActividad).then(res => this.modalController.dismiss());
  }
}
