import { Component, OnInit, ViewChild, ɵpatchComponentDefWithScope  } from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
})
export class ActividadesPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  listaActividades: any = [];
  form: FormGroup;
  formulario: any;
  lista: any = [];
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  constructor(
    private alertController: AlertController,
    private proveedor: ProviderService,
    private fb: FormBuilder,
  ) { 
    this.newForm();

  }

  ngOnInit() {
  }

  agregarActividad() {
    let object = {};
    this.proveedor.InsertarDocumento('actividad/post', object);
  }

  newForm() {
    this.form = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'tipo': new FormControl("", Validators.required),
    })
  }

  formWithData(actividad: any) {
    this.form = this.fb.group({
      'nombre': new FormControl(actividad.nombre, Validators.required),
      'tipo': new FormControl(actividad.tipo, Validators.required),
    })
  }

  cancel() {
    this.form.reset();
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  filtrarTipo(event) {
    const text = event.target.value;
    if(text === 'todos') {
      this.listaActividades = this.lista;
      return;
    }
    this.listaActividades = this.lista;
    if (text && text.trim() !== '') {
      this.listaActividades = this.lista.filter(
        (e) => e.tipo.toLowerCase().indexOf(text.toLowerCase()) > -1
      );
    }
  }

  buscarActividad(event) {
    const text = event.target.value;
    this.listaActividades = this.lista;
    if (text && text.trim() !== '') {
      this.listaActividades = this.lista.filter(
        (e) => e.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1
      );
    }
  }

  ionViewWillEnter() {
    this.proveedor
      .obtenerDocumentos('actividades/documents')
      .then((data) => {
        this.listaActividades = data;
        this.lista = data;
      })
      .catch((data) => {
        console.log(data);
      });
  }

  async handleSubmit() {
    this.formulario = this.form.value;
    if (this.form.invalid) {
      const alert = await this.alertController.create({
        header: '¡Datos incompletos',
        message: 'Rellene todos los campos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    this.proveedor.InsertarDocumento('actividades/post', this.formulario)
    .then(res => {
      this.ionViewWillEnter();
      this.cancel();
    }).catch(err => console.log(err));
  }

  actualizarActividad(actividad: any) {
    this.formWithData(actividad);
  }

  eliminarDato(id) {
    console.log(id);
    let status: any = false;
    this.proveedor.eliminarDocumento('actividades/documents/', id).subscribe(
      (data) => {
        console.log(data);
        this.ionViewWillEnter();
      },
      (err) => {
        console.log(err);
        
      }
    ).closed;
  }
}
