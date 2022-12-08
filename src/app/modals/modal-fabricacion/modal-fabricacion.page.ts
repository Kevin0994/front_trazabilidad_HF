import { Component, Input ,OnInit } from '@angular/core';
import { FormArray, FormBuilder,  FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-modal-fabricacion',
  templateUrl: './modal-fabricacion.page.html',
  styleUrls: ['./modal-fabricacion.page.scss'],
})
export class ModalFabricacionPage implements OnInit {

  @Input() Producto: any="init";
  @Input() Categoria: any;
  @Input() MateriaPrima: any;
  @Input() showSemi: any;
  @Input() showFinal: any;
  public formRegistro: FormGroup;
  private formulario:any;
  private loteMateriaPrima:any;
  private inventario:any;

  constructor(private providerMensajes:ProviderMensajes,
    public proveedor: ProviderService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private modalController:ModalController,) { }

  ngOnInit() {
    if(this.showSemi == true){
      this.newFormSemi();
    }
    if(this.showFinal == true){
      this.newFormFinal();
    }
  }

  ionViewWillEnter() {

  }

  closeModal(){
    this.modalController.dismiss();
  }

  async saveProfile(){
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

    let form = this.formulario;

    this.MateriaPrima.map(function(doc,index,array){
      array[index]['peso'] = form.materiaPrimaForm[index];
    })

    console.log(this.MateriaPrima);

    if(this.showSemi == true){
      this.proveedor.InsertarDocumento('inventarioProducto/stock/',this.MateriaPrima).then(data => {
        console.log('entroo');
        this.loteMateriaPrima = data;
        console.log( this.loteMateriaPrima);
        if(this.proveedor.status){

          this.inventario = {
            codigo: this.Producto.id,
            n_proceso: this.formulario.proceso,
            materiaPrima: this.MateriaPrima.map(doc=>(doc.id)), //Array con los productos usados como materia prima
            nombre: this.Producto.nombre, //nombre producto semifinal
            lote_mp: this.loteMateriaPrima, //lote materia prima
            lote: new Date().getMonth() + 1, //lote producto semifinal
            fechaEntrada: new Date(),
            responsable: localStorage.getItem('Usuario'),
            estado: 'En proceso',
          }

          console.table(this.inventario);
          console.table(this.loteMateriaPrima);

          this.proveedor.InsertarDocumento('inventarioProductoSemifinal/post',this.inventario).then(data => {
            console.log(data);
            if(this.proveedor.status){
              this.MensajeServidor();
            }else{
              this.providerMensajes.ErrorMensajeServidor(this.alertController);
              return;
            }
          }).catch(data => {
            console.log(data);
          }); 
        }else{
          this.providerMensajes.ErrorMensajePersonalizado(this.alertController,this.loteMateriaPrima.error.messege);
          return; 
        }
      }).catch(data => {
        console.log(data);
      }); 
    }

    if(this.showFinal == true){
      this.proveedor.actualizarDocumento('inventarioProductoSemifinales/stock/',this.MateriaPrima.id,'peticion').then(data => {
        this.loteMateriaPrima = data;
        if(this.proveedor.status){
          this.inventario = {
            codigo: this.Producto.id,
            n_proceso: this.formulario.proceso,
            nombre_mp: this.MateriaPrima.nombre, //nombre matria prima
            nombre: this.Producto.nombre, //nombre producto semifinal
            lote_mp: this.loteMateriaPrima, //lote materia prima
            lote: new Date().getMonth() + 1, //lote producto semifinal
            peso_mp: this.formulario.pesoMateriaPrima, //peso materia prima
            unidades:this.formulario.unidades,
            pesoFinal: this.formulario.pesoFinal,
            fechaEntrada: new Date(),
            responsable: localStorage.getItem('Usuario'),
            estado: 'Terminado',
          }

          console.table(this.inventario);
          console.table(this.loteMateriaPrima);

          this.proveedor.InsertarDocumento('inventarioProductoFinal/post',this.inventario).then(data => {
            console.log(data);
            if(this.proveedor.status){
              this.MensajeServidor();
            }else{
              this.providerMensajes.ErrorMensajeServidor(this.alertController);
              return;
            }
          }).catch(data => {
            console.log(data);
          });
        }else{
          this.providerMensajes.ErrorMensajeServidor(this.loteMateriaPrima.error.messege);
          return;
        }
      }).catch(data => {
        console.log(data);
      });
    }


  }

  newFormSemi(){
    this.formRegistro = this.fb.group({
      proceso: ['', [Validators.required]],
      nombre : [this.Producto.nombre, [Validators.required]],
      materiaPrimaForm : this.fb.array([]),
    });

    this.addMateriaPrima();
    //this.formRegistro.controls.materiaPrimaForm.disable();
  }

  newFormFinal(){
    this.formRegistro = this.fb.group({
      proceso: ['', [Validators.required]],
      nombre : [this.Producto.nombre, [Validators.required]],
      materiaPrimaForm : this.fb.array([]),
      presentacion: ['', [Validators.required]],
      unidades: ['', [Validators.required]],
      pesoFinal: ['', [Validators.required]],
    })
    this.addMateriaPrima();
  }

  get materiaPrimaForm(){
    return this.formRegistro.get('materiaPrimaForm') as FormArray;
  }

  addMateriaPrima(){
    let form = this.materiaPrimaForm;
    let formBuilder = this.fb;

    this.MateriaPrima.forEach(function(doc) {
      form.push(formBuilder.control(doc.peso, [Validators.required]));
    });
  }

  handleChangeUnidades(ev){
    let pesoFinal = this.formRegistro.value.presentacion * ev.detail.value;
    this.formRegistro.controls.pesoFinal.setValue(pesoFinal);

  }


  async MensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Registro',
      message: 'El registro se completo con exito',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.closeModal();
          }
        }]
    });

    await alert.present();
  }

}
