import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ProviderService } from '../../../provider/ApiRest/provider.service';
import { AlertController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  Usuario: any = [];
  formLogin: FormGroup;

  constructor(
    public proveedor: ProviderService,
    private providerMensajes:ProviderMensajes,
    public fb: FormBuilder,
    public navCtrl: NavController,
    public alertController: AlertController,
    private menu: MenuController,
    private cookieService: CookieService
  ) {
    this.menu.enable(false);
    this.formLogin = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {}

  async ingresar(token) {
    if (this.Usuario) {
      this.cookieService.set('idUsuario', this.Usuario.id, 5, '/');
      this.cookieService.set('token', token)
      localStorage.setItem('Usuario', this.Usuario.UserName);
      this.navCtrl.navigateRoot('/home');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos incorrectos',
        text: 'Usuario o contraseña incorrecto',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#91bb35',
        heightAuto: false,
      });
      return;
    }
  }

  async ValidarUsuario() {
    let form = this.formLogin.value;
    if (this.formLogin.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Rellene los campos del formulario',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#91bb35',
        heightAuto: false,
      });
      return;
    } else {
      await this.providerMensajes.showLoading();
      this.proveedor.InsertarDocumento('usuario/login', form)
        .then((data) => {
          let userAuth:any = data;
          console.log('data: ', data);
          this.Usuario = userAuth.user;
          // console.log(this.Usuario);
          // console.log(data);
          this.providerMensajes.dismissLoading();
          this.ingresar(userAuth.token);
        })
        .catch((data) => {
          this.providerMensajes.dismissLoading();
          Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'Correo o contraseña incorrectos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#91bb35',
            heightAuto: false,
          });
        });
    }
  }
}
