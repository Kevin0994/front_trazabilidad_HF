import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.page.html',
  styleUrls: ['./modal-producto.page.scss'],
})
export class ModalProductoPage implements OnInit {

  @ViewChild('imgElement') imgElement: ElementRef;

  @Input() Producto: any="init"; //Variable que obtiene las datos del producto seleccionado a editar
  @Input() url: any; //string con la url para realizar la peticion al API
  @Input() type: any; //titulo de la operacion a realizar como insertar o editar
  @Input() post: boolean; //ariable que se utiliza para validar que accion se va a realizar (post, put)
  @Input() tabla: any; //Especifica el tipo de producto que entra, semifinal o final

  public formRegistro: FormGroup;
  private formulario:any;
  public listaCategorias:any; 
  public categoria:any={ //Guarda los datos especificos de la categoria escogida por el usuario
    id:'',
    nombre: '',
  };
  private producto:any;
  public listaMateriaPrima:any=[];
  //public presentacion: any = Array();
  public materiaPrima: any = Array({ 
    id:'',
    nombre: '',
  });
  public img: any;
  public imgURL: any = 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000';
  public imgCapture: any = false;
  private responseImg:any;
  public base64TrimmedURL:any;
  public base64DefaultURL:any;

  constructor(public proveedor: ProviderService,
    private providerMensajes:ProviderMensajes,
    public fb: FormBuilder,
    public navCtrl:NavController,
    public alertController: AlertController,
    public modalController:ModalController,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log(this.Producto);

    if(this.post){
      if(this.tabla === 'Semi'){
        this.newFormSemi();
      }
      if(this.tabla === 'Final'){
        this.newFormFinal();
      }
    }else{
      if(this.tabla === 'Semi'){
        this.editFormSemi();
      }
      if(this.tabla === 'Final'){
        //this.editFormSemi();
      }
    }
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos(){

    this.categoria ={
      id: this.Producto.categoriaId,
      nombre: this.Producto.categoria
    }
     //obtiene los alimentos y productos semifinales
     this.proveedor.obtenerDocumentos('productos/alldocuments').then(data => {
      this.listaMateriaPrima = data;
      if(this.type != 'Nuevo Registro'){
        console.log('Entro');
        this.materiaPrima = {
          id: this.Producto.materiaPrima,
          nombre: this.listaMateriaPrima.filter((alimento) => alimento.id === this.Producto.materiaPrima)[0].nombre
        }
      }
      console.log(this.materiaPrima);
    }).catch(data => {
      console.log(data);
    })

    if(this.tabla === 'Semi'){
      //Obtiene las categorias que existen en firestore
      this.proveedor.obtenerDocumentos('categoriaProductoSemi/documents').then(data => {
        this.listaCategorias = data;
        console.log(this.listaCategorias);
      }).catch(data => {
        console.log(data);
      })
    }

    if(this.tabla === 'Final'){

      //Obtiene las categorias que existen en firestore
      this.proveedor.obtenerDocumentos('categoriaProductoFinal/documents').then(data => {
        this.listaCategorias = data;
        console.log(this.listaCategorias);
      }).catch(data => {
        console.log(data);
      })

    }
  }

  handleChangeCategoria(ev) {
    this.categoria = {
      id: ev.detail.value,
      nombre:  this.listaCategorias.filter(doc => doc.id == ev.detail.value)[0].nombre
    }
  }

  handleChangeAlimento(ev,index) {

    let file = {
      id: ev.detail.value,
      nombre:  this.listaMateriaPrima.filter((alimento) => alimento.id === ev.detail.value)[0].nombre
    }

    this.materiaPrima[index]=file;

    console.log(this.materiaPrima);
  }

  closeModal(){
    this.modalController.dismiss();
  }

  newFormSemi(){
    this.img ={
      url: 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000',
      name: 'imagenExample',
    }
    this.formRegistro = this.fb.group({
      categoria: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      nombre : ['', [Validators.required]],
      materiaPrimaForm : this.fb.array([
        this.fb.control('', [Validators.required]),
      ]),
    });
  }

  newFormFinal(){
    this.img ={
      url: 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000',
      name: 'imagenExample',
    }
    this.formRegistro = this.fb.group({
      categoria: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      nombre : ['', [Validators.required]],
      presentacionForm : this.fb.array([
        this.fb.control('', [Validators.required]),
      ]),
      materiaPrimaForm : this.fb.array([
        this.fb.control('', [Validators.required]),
      ]),
    });
  }

  get presentacionForm(){
    return this.formRegistro.get('presentacionForm') as FormArray;
  }

  get materiaPrimaForm(){
    return this.formRegistro.get('materiaPrimaForm') as FormArray;
  }

  addPresentacion(){
    this.presentacionForm.push(this.fb.control('', [Validators.required]));
    //this.presentacion.push('');
  }

  addMateriaPrima(){
    this.materiaPrimaForm.push(this.fb.control('', [Validators.required]));
    this.materiaPrima.push({
      id:'',
      nombre: '',
    })
  }

  deletePresentacion(index: number){
    this.presentacionForm.removeAt(index);
  }

  deleteMateriaPrima(index: number){
    this.materiaPrimaForm.removeAt(index);
  }

  editFormSemi(){
    this.imgURL = this.Producto.img.url;
    this.img = this.Producto.img;
    this.formRegistro =  this.fb.group({
      'categoria': new FormControl(this.Producto.categoriaId,Validators.required),
      'codigo': new FormControl(this.Producto.id,Validators.required),
      'nombre': new FormControl(this.Producto.nombre,Validators.required),
      'materiaPrima': new FormControl(this.Producto.materiaPrima,Validators.required),
    })
    this.categoria.nombre = this.Producto.categoria;

  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
          resolve({
            blod: $event,
            image,
            base: reader.result
          });
        };
        reader.onerror = error => {
          resolve({
            blod: $event,
            image,
            base:null
          });
        };
      }catch(e){
        return null;
      }
  })

  capturarFile(event): any {
    let imageFile = event.target.files[0];
    this.extraerBase64(imageFile).then((imagen:any) => {
      this.imgURL = imagen.base;
      this.img = {
        base: imagen.base,
        name: imageFile.name,
        type: imageFile.type,
      }
      this.imgCapture = true;
    })
  }

  async saveProfile(){
    this.formulario = this.formRegistro.value;
    if(this.formRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    let refMateriaPrima = this.materiaPrima.map((doc, index) => ({
      id: doc.id,
      nombre: doc.nombre,
      peso: (<HTMLInputElement>document.getElementById(index)).value
    }))

    this.producto = {
      id: this.formulario.codigo,
      nombre: this.formulario.nombre,
      presentacion: this.formulario.presentacion,
      img: this.img,
      materiaPrima: refMateriaPrima,
      categoriaId: this.categoria.id,
      status: this.imgCapture,
    }

    if(this.post === true){

      if(this.tabla === 'Final'){
        this.producto['presentacion']=this.formulario.presentacionForm;
      }

      console.table(this.producto.materiaPrima);
      console.table(this.producto);
      this.proveedor.InsertarDocumento(this.url,this.producto).then(data => {
        console.log('termino');
        this.responseImg = data;
        console.log(this.responseImg);
        if(this.proveedor.status){
          this.producto['categoria']=this.categoria.nombre;
          this.producto['status']=this.responseImg.status;

          if(this.imgCapture){
            this.producto['img']=this.responseImg.img;
          }

          this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.producto);
        }else{
          this.providerMensajes.ErrorMensajePersonalizado(this.alertController,this.responseImg.error);
          return;
        } 
      }).catch(data => {
        console.log(data);
        this.providerMensajes.ErrorMensajePersonalizado(this.alertController,data.error);

      });

    }
    if(this.post === false){

      this.producto['materiaPrima']= this.formulario.materiaPrima;
      this.producto['categoriaIdOld']= this.Producto.categoriaId;

      if(this.imgCapture){
        this.producto.img['imgOld'] = this.Producto.img;
      }

      /* if(this.Producto.categoria == this.categoria.nombre &&
        this.Producto.id == this.producto.id &&
        this.Producto.img == this.producto.img &&
        this.Producto.materiaPrima == this.producto.materiaPrima &&
        this.Producto.nombre == this.producto.nombre){
          this.closeModal();
      }else{ */
        console.log(this.producto);
        this.proveedor.actualizarDocumento(this.url,this.Producto.id,this.producto).then(data => {
          this.responseImg = data;
          console.log(data);
          if(this.proveedor.status){
            this.producto['categoria']=this.categoria.nombre;
            this.producto['status']=this.responseImg.status;
            this.producto['img']=this.responseImg.img;
            this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.producto);
          }else{
            this.providerMensajes.ErrorMensajeServidor(this.alertController);
            return;
          }
        }).catch(data => {
          console.log(data);
        });
      //}
    }
  }

}
