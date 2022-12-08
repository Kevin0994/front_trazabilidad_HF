import { Component, OnInit, ViewChild, ɵpatchComponentDefWithScope  } from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
})
export class ActividadesPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  listaActividades: any = [];
  lista: any = [];
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  constructor(
    private proveedor: ProviderService,
  ) { }

  ngOnInit() {
  }

  agregarActividad() {
    let object = {};
    this.proveedor.InsertarDocumento('actividad/post', object);
  }

  cancel() {
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
}
