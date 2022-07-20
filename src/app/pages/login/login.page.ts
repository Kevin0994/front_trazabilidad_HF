import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { AlertController, NavController  } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  Usuario:any=[];
  formLogin: FormGroup;

  constructor(public proveedor: ProviderService,
    public fb: FormBuilder,
    public navCtrl:NavController,
    public alertController: AlertController,) { 
    this.formLogin = this.fb.group({
      'email': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required),
    })
  }

  ngOnInit() {
  }

  async ingresar(){
    var form = this.formLogin.value;

    if(this.Usuario.length != 0){
      localStorage.setItem('ingresado','true');
      this.navCtrl.navigateRoot('/home');
    }else{
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Los datos no son correctos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    
  }

  async ValidarUsuario() {
    var form = this.formLogin.value;
    if(this.formLogin.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }else{
      this.proveedor.BuscarUsuario(form.email,form.password).then(data => {
        this.Usuario=data;
        console.log(this.Usuario);
        this.ingresar();
      }).catch(data => {
        console.log(data);
      });
    }
  }

}
