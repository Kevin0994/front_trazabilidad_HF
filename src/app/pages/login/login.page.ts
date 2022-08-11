import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { AlertController, NavController  } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2'

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
    public alertController: AlertController,
    private menu: MenuController,
    private cookieService: CookieService) { 
      this.menu.enable(false);
      this.formLogin = this.fb.group({
        'email': new FormControl("",Validators.required),
        'password': new FormControl("",Validators.required),
      })
  }

  ngOnInit() {
  }

  async ingresar(){

    if(this.Usuario.length != 0){
      this.cookieService.set('idUsuario',this.Usuario[0].id,5,'/');
      localStorage.setItem('Usuario',this.Usuario[0].UserName);
      this.navCtrl.navigateRoot('/home');
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Datos incorrectos',
        text: 'Usuario o contraseña incorrecto',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#91bb35',
        heightAuto: false
        }
      )
      return;
    }
    
  }

  async ValidarUsuario() {
    var form = this.formLogin.value;
    if(this.formLogin.invalid){
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Rellene los campos del formulario',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#91bb35',
        heightAuto: false
        }
      )
      return;
    }else{
      this.proveedor.validarUsuario('usuario',form.email,form.password).then(data => {
        this.Usuario=data;
        console.log(this.Usuario);
        this.ingresar();
      }).catch(data => {
        console.log(data);
      });
    }
  }

}
