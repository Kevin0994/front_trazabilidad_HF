import { Component, OnInit } from '@angular/core';

import { AlertController, NavController } from '@ionic/angular';
import { ProviderService } from '../../../provider/ApiRest/provider.service'

@Component({
  selector: 'app-cosecha',
  templateUrl: './cosecha.page.html',
  styleUrls: ['./cosecha.page.scss'],
})
export class CosechaPage implements OnInit {

  cosechas:any=[];

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController) { }

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
