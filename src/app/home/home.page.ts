import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ProviderService } from '../../provider/ApiRest/provider.service'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  cosechas

  constructor(public proveedor: ProviderService,) {

  }

  ngOnInit() {
    this.ionViewDidLoad();
  }

  ionViewDidLoad(){
    this.proveedor.loadCosecha().then(data => {
      this.cosechas=data;
      console.log(this.cosechas)
    }).catch(data => {
      console.log(data);
    })
  }

}
