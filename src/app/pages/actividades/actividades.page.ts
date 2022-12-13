import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalActividadesPage } from '../../modals/modal-actividades/modal-actividades.page'

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
})
export class ActividadesPage implements OnInit {
  listaActividades: any = [];
  lista: any = [];
  constructor(
    private proveedor: ProviderService,
    public modalController: ModalController ,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }

  async abrirModal(tipo: any, dato: any) {
    const modal = await this.modalController.create({
      component: ModalActividadesPage,
      cssClass: 'customClass',
      componentProps: {
        type: tipo,
        actividad: dato
      },
    });

    modal.onDidDismiss().then((data) => {
      this.ionViewWillEnter();
    });
    return await modal.present();
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

  async presentAlert(id: any) {
    const alert = await this.alertController.create({
      header: '¿Está seguro de eliminar el dato?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'confirm',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if(role === 'confirm')
      this.eliminarDato(id);
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

  eliminarDato(id) {
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
