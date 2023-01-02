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
  public recetaProducto:any;
  public presentacion:number;

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

    await this.providerMensajes.showLoading();

    let loteMes = new Date().getMonth() + 1;
    let loteCalculado = this.proveedor.calcularLote();

    if(this.showSemi == true){
      let form = this.formulario;

      this.MateriaPrima.map(function(doc,index,array){
        array[index]['peso'] = form.materiaPrimaForm[index];
      })

      console.log(this.MateriaPrima);

      this.proveedor.InsertarDocumento('inventarioProducto/stock/',this.MateriaPrima).then(data => {
        let responseStock = data as any;
        console.log( this.loteMateriaPrima);
        if(this.proveedor.status){

          this.inventario = {
            codigo: this.Producto.codigo,
            n_proceso: this.formulario.proceso,
            nombre: this.Producto.nombre, //nombre producto semifinal
            lote_mp: responseStock, //lote materia prima
            loteMes: loteMes, //lote del mes
            lote: loteCalculado, //lote con mes y dia
            fechaEntrada: new Date(),
            responsable: localStorage.getItem('Usuario'),
            estado: 'En proceso',
          }

          console.table(this.inventario);
          console.table(responseStock);

         this.proveedor.InsertarDocumento('inventarioProductoSemifinal/post',this.inventario).then(data => {
            console.log(data);
            let response = data as any;
            if(this.proveedor.status){
              this.providerMensajes.dismissLoading();
              this.MensajeServidor();
              return;
            }else{
              this.providerMensajes.dismissLoading();
              if(response.error.code == undefined){
                this.providerMensajes.ErrorMensajeServidor();
                return;
              }
  
              if(response.error.code === 6){
                this.providerMensajes.ErrorMensajePersonalizado('Ya existe un producto con este ingreso, ingrese uno diferente');
                return;
              }

              this.providerMensajes.ErrorMensajeServidor();
              return;
            }
          }).catch(data => {

            console.log(data);
            this.providerMensajes.ErrorMensajeServidor();
            return;

          });
        }else{
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajePersonalizado(responseStock.error.messege);
          return;
        }
      }).catch(data => {
        this.providerMensajes.dismissLoading();
        this.providerMensajes.ErrorMensajeServidor();
        console.log(data);
      });
    }


    if(this.showFinal == true){

      let recetaForm;
      let unidades = this.formulario.unidades

      console.log(this.recetaProducto);

      recetaForm = this.recetaProducto.map((doc,index) => ({
        id: doc.id,
        nombre: doc.nombre,
        peso : parseFloat((<HTMLInputElement>document.getElementById(index)).value) * unidades,
      }));

      console.log(recetaForm);

      this.proveedor.InsertarDocumento('inventarioProducto/stock/',recetaForm).then(data => {
        let responseStock = data as any;
        console.table(responseStock);
        if(this.proveedor.status){
          let pesoMp = 0;
          recetaForm.forEach(function(doc){
            pesoMp += doc.peso;
          })
          this.inventario = {
            codigo: this.Producto.codigo,
            n_proceso: this.formulario.proceso,
            nombre: this.Producto.nombre, //nombre producto semifinal
            lote_mp: responseStock, //lote materia prima
            loteMes: loteMes,
            lote: loteCalculado, //lote producto semifinal
            unidades:this.formulario.unidades,
            pesoFinal: this.formulario.pesoFinal,
            fechaEntrada: new Date(),
            responsable: localStorage.getItem('Usuario'),
            conversion: pesoMp/this.formulario.pesoFinal,
            estado: 'Terminado',
          } 

          console.table(this.inventario); 
          console.table(responseStock);

          this.proveedor.InsertarDocumento('inventarioProductoFinal/post',this.inventario).then(data => {
            console.log(data);
            let response = data as any;
            if(this.proveedor.status){
              this.providerMensajes.dismissLoading();
              this.MensajeServidor();
            }else{
              this.providerMensajes.dismissLoading();
              if(response.error.code == undefined){
                this.providerMensajes.ErrorMensajeServidor();
                return;
              }
  
              if(response.error.code === 6){
                this.providerMensajes.ErrorMensajePersonalizado('Ya existe un producto con este ingreso, ingreso uno diferente');
                return;
              }

              this.providerMensajes.ErrorMensajeServidor();
              return;
            }
          }).catch(data => {
            this.providerMensajes.dismissLoading();
            console.log(data);
          });
        }else{
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajePersonalizado(responseStock.error.messege);
          return;
        } 
      }).catch(data => {
        this.providerMensajes.dismissLoading();
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
    this.presentacion = this.MateriaPrima[0].presentacion;
    this.recetaProducto = this.MateriaPrima[0].materiaPrima;
    this.formRegistro = this.fb.group({
      proceso: ['', [Validators.required]],
      nombre : [this.Producto.nombre, [Validators.required]],
      presentacion: [this.presentacion, [Validators.required]],
      unidades: ['', [Validators.required]],
      pesoFinal: ['', [Validators.required]],
    })
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

  handleChangePresentacion(ev){

    this.presentacion = ev.detail.value;
    let index;
    this.MateriaPrima.every(function(doc,i){
        if(doc.presentacion == ev.detail.value) {
          index = i;
          return false;
        }
        return true;
    })

   this.recetaProducto = this.MateriaPrima[index].materiaPrima
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
