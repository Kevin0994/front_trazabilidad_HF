import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Input() receta: any; 
  @Input() materiaPrima: any;
  @Input() listaMateriaPrima: any;


  public formRegistro: FormGroup;
  public formRegistroMP: FormGroup;
  private formulario:any;
  public listaCategorias:any; 
  public categoria:any={ //Guarda los datos especificos de la categoria escogida por el usuario
    id:'',
    nombre: '',
  };
  private producto:any;
  public img: any;
  public imgURL: any = 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000';
  public imgCapture: any = false;
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
    this.cargarDatos();
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
        this.editFormFinal();
      }
    }
    
  }

  ionViewWillEnter() {
    
  }

  cargarDatos(){

    this.categoria ={
      id: this.Producto.categoriaId,
      nombre: this.Producto.categoria
    }
    
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
    return this.Producto.materiaPrima;
  }

  handleChangeCategoria(ev) {
    this.categoria = {
      id: ev.detail.value,
      nombre:  this.listaCategorias.filter(doc => doc.id == ev.detail.value)[0].nombre
    }
  }

  handleChangeAlimentoFinal(ev,i,n) {

   let file = {
      id: ev.detail.value,
      nombre:  this.listaMateriaPrima.filter((alimento) => alimento.id === ev.detail.value)[0].nombre
    }

    this.receta[i].materiaPrima[n]=file;

    console.log(this.receta);
  }

  handleChangeAlimentoSemi(ev,index) {

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

  get materiaPrimaForm(){
    return this.formRegistro.get('materiaPrimaForm') as FormArray;
  }


  //agrega un form control al array del formulario cuando se ingreso un producto Semifinal
  addMateriaPrimaSemi(){
    this.materiaPrimaForm.push(this.fb.control('', [Validators.required]));
    this.materiaPrima.push({
      id:'',
      nombre: '',
    })
  }
  //Elimina un form control al array del formulario cuando se ingreso un producto Semifinal
  deleteMateriaPrimaSemi(index: number){
    this.materiaPrima.splice(index,1);
    this.materiaPrimaForm.removeAt(index);
  }

  async newFormFinal(){
    this.img ={
      url: 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000',
      name: 'imagenExample',
    }
    this.formRegistro = this.fb.group({
      categoria: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      nombre : ['', [Validators.required]],
      recetaForm : this.fb.array([
      ]),
    });

    await this.initRecetaForm();
    this.materiaPrimaFormPF.push(this.fb.control('', [Validators.required]))
    this.recetaForm.push(this.formRegistroMP);

  }

  get recetaForm(){
    return this.formRegistro.get('recetaForm') as FormArray;
  }


  //agrega un Formarray vinculado a una receta del formulario cuando se ingreso un producto Final
  addReceta(){
    this.initRecetaForm();
    this.materiaPrimaFormPF.push(this.fb.control('', [Validators.required]))
    this.recetaForm.push(this.formRegistroMP);
    this.receta.push({
      presentacion:'',
      materiaPrima: Array({
        id:'',
        nombre: '',
      })
    });
    console.log(this.recetaForm);
  }

  //agrega un form control al array del formulario cuando se ingreso un producto Final
  addMateriaPrimaFi(index:number){
    let refRecetaForm= this.recetaForm.controls[index] as FormGroup;
    let refMateriaForm = refRecetaForm.controls.materiaPrimaForm as FormArray;
    refMateriaForm.controls.push(this.fb.control('', [Validators.required]));
    console.log(this.recetaForm);
    this.receta[index].materiaPrima.push({
      id:'',
      nombre: '',
    })
    console.log(this.receta);
  }
  //Elimina un form control al array del formulario cuando se ingreso un producto Semifinal
  deleteRecetaFi(index: number){
    console.log(this.recetaForm);
    this.recetaForm.removeAt(index);
    this.receta.splice(index,1);
  }

   //Elimina un form control al array del formulario cuando se ingreso un producto Semifinal
   deleteMateriaPrimaFi(indexRe:number,indexMp: number){
    let refRecetaForm= this.recetaForm.controls[indexRe] as FormGroup;
    let refMateriaForm = refRecetaForm.controls.materiaPrimaForm as FormArray;
    refMateriaForm.removeAt(indexMp);
    this.receta[indexRe].materiaPrima.splice(indexMp,1);
    console.log(this.recetaForm);
  }

  editFormSemi(){
    this.imgURL = this.Producto.img.url;
    this.img = this.Producto.img;
    this.formRegistro =  this.fb.group({
      categoria: [this.Producto.categoriaId, [Validators.required]],
      codigo: [this.Producto.id, [Validators.required]],
      nombre : [this.Producto.nombre, [Validators.required]],
      materiaPrimaForm : this.fb.array([]),
    })
    
    this.cargarformularioSemi();
  }

  cargarformularioSemi(){

    let self = this;
    this.Producto.materiaPrima.forEach(function(doc,index) {
      self.materiaPrimaForm.push(self.fb.control(doc.peso, [Validators.required]))
    });

    console.log(this.formRegistro);

  }

  async editFormFinal(){
    this.imgURL = this.Producto.img.url;
    this.img = this.Producto.img;
    this.formRegistro =  this.fb.group({
      categoria: [this.Producto.categoriaId, [Validators.required]],
      codigo: [this.Producto.id, [Validators.required]],
      nombre : [this.Producto.nombre, [Validators.required]],
      recetaForm: this.fb.array([]),

    })
    await this.initRecetaForm();
    await this.cargarformularioFinal();

  }

  get materiaPrimaFormPF(){
    return this.formRegistroMP.get('materiaPrimaForm') as FormArray;
  }


  async initRecetaForm() {
    this.formRegistroMP = this.fb.group({
      presentacion : ['', [Validators.required]],
      materiaPrimaForm: this.fb.array([]),
    });
  }

  cargarformularioFinal(){

    let self = this;
    console.log(this.formRegistroMP);

    this.Producto.receta.map( function (re,i){

      self.formRegistroMP.controls.presentacion.setValue(re.presentacion);

      re.materiaPrima.map( function (mp, n){

        self.materiaPrimaFormPF.push(self.fb.control(mp.peso, [Validators.required]))

      })
      self.recetaForm.push(self.formRegistroMP);
      self.initRecetaForm();
    });
    console.log(this.formRegistro);
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
    console.log(this.formulario);
    if(this.formRegistro.invalid){
      this.providerMensajes.MessegeValiteForm(this.alertController);
      return;
    }

    this.producto = {
      id: this.formulario.codigo,
      nombre: this.formulario.nombre,
      img: this.img,
      categoriaId: this.categoria.id,
      status: this.imgCapture,
    }

    let refMateriaPrima = Array();
    let arrayMateriaPrima;

    if(this.tabla === 'Semi'){
      if(this.materiaPrima[0].id === '' && this.materiaPrima[0].nombre === ''){
        this.providerMensajes.MessegeValiteFormPersonalizado(this.alertController,'Falta seleccionar la materia prima');
        return;
      }
      arrayMateriaPrima = this.materiaPrima;
      refMateriaPrima = arrayMateriaPrima.map((doc, index) => ({
        id: doc.id,
        nombre: doc.nombre,
        peso: this.formulario.materiaPrimaForm[index]
      }));
      console.log(refMateriaPrima);
      this.producto['materiaPrima']=refMateriaPrima;
    }

    if(this.tabla === 'Final'){

      let self=this;
      let refReceta;
      let refMp;
      
      this.receta.forEach(function (doc,i,receta){
        refReceta = self.recetaForm.controls[i] as FormGroup;
        receta[i].presentacion = refReceta.controls.presentacion.value;
        doc.materiaPrima.forEach(function (doc,n,recetaMp){
          refMp = refReceta.controls.materiaPrimaForm as FormArray;
          recetaMp[n]['peso'] = refMp.controls[n].value;
        })
      })
      
      this.producto['receta']=this.receta;
      console.log(this.producto);
    }

    if(this.post === true){
      this.insertarProducto();
 
    }
    if(this.post === false){
      this.actualizarProductos();
    }
  }

  insertarProducto(){
    /* if(!this.validarMateriaPrima()){
      this.providerMensajes.ErrorMensajePersonalizado(this.alertController,'No se puede repetir la materia prima, revise el formulario');
      return;
    } */

    console.table(this.producto);
    this.proveedor.InsertarDocumento(this.url,this.producto).then(data => {
      console.log('termino');
      let response = data as any;
      console.log(response);
      if(this.proveedor.status){
        this.producto['categoria']=this.categoria.nombre;
        this.producto['status']=response.status;
        if(this.tabla === 'Semi'){
          this.producto['materiaPrima']=response.refMateriaPrima;
        }

        if(this.tabla === 'Final'){
          this.producto['receta']=response.refMateriaPrima;
        }

        if(this.imgCapture){
          this.producto['img']=response.img;
        }

        this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.producto);
      }else{
        this.providerMensajes.ErrorMensajePersonalizado(this.alertController,response.error);
        return;
      }
    }).catch(data => {
      console.log(data);
      this.providerMensajes.ErrorMensajePersonalizado(this.alertController,data.error);

    });
  }

  actualizarProductos(){

    this.producto['oldProduct']= this.Producto;

    if(this.imgCapture){
      this.producto.img['imgOld'] = this.Producto.img;
    }

    /* if(this.Producto.categoria == this.categoria.nombre &&
      this.Producto.id == this.producto.id &&
      this.Producto.img == this.producto.img &&
      this.Producto.nombre == this.producto.nombre){

        this.closeModal();

    }else{ */

      /* if(!this.validarMateriaPrima()){
        this.providerMensajes.ErrorMensajePersonalizado(this.alertController,'No se puede repetir la materia prima, revise el formulario');
        return;
      } */

      console.log(this.producto);
      this.proveedor.actualizarDocumento(this.url,this.Producto.id,this.producto).then(data => {
        let response = data as any;
        console.log(data);
        if(this.proveedor.status){
          this.producto['idOld']=this.Producto.id;
          this.producto['categoria']=this.categoria.nombre;
          this.producto['status']=response.status;
          if(this.tabla === 'Semi'){
            this.producto['materiaPrima']=response.refMateriaPrima;
          }
  
          if(this.tabla === 'Final'){
            this.producto['receta']=response.refMateriaPrima;
          }

          this.producto['img']=response.img;
          this.providerMensajes.MensajeModalServidor(this.modalController,this.alertController,this.producto);
        }else{
          this.providerMensajes.ErrorMensajeServidor(this.alertController);
          return;
        }
      }).catch(data => {
        console.log(data);
      });
  }
 //}

 validarMateriaPrimaForm(){
  let numOldProduct = this.Producto.materiaPrima.length;
  let numProduct = this.producto.materiaPrima.length;
  let refProductmp = this.producto.materiaPrima;
  let status = true;
  if(numOldProduct ===  numProduct){
    this.Producto.materiaPrima.every(function(doc,index){
      let refmp;
      if(doc.id._path.segments.length > 2){
        refmp = doc.id._path.segments[3];
      }else{
        refmp = doc.id._path.segments[1];
      }

      if(refmp != refProductmp[index].id || doc.peso != refProductmp[index].peso){
        status = false;
        return false;
      }
      return true;
    })
  }else{
    return status = false;
  }
  return status;
 }

 validarMateriaPrima(){
  let refProductmp = this.producto.materiaPrima;
  let status = true;
  
  for(let i = 0; i < refProductmp.length; ++i){
    refProductmp.every(function(doc,index){
      if(i === index){
        return true;
      }
      if(refProductmp[i].id === doc.id){
        status = false;
        return false;
      }
      return true;
    })

    if(!status){
      i=refProductmp.length;
    }
  }
  return status;
 }


}