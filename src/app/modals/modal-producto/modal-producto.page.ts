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
  public materiaPrima: any = [{ 
    id:'',
    nombre: '',
  }];
  public receta: any = [Array({ 
    id:'',
    nombre: '',
  })];
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
        //this.editFormSemi();
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
     //obtiene los alimentos y productos semifinales
    this.proveedor.obtenerDocumentos('productos/alldocuments').then(data => {
      this.listaMateriaPrima = data;
      if(this.type != 'Nuevo Registro'){
        console.log(this.listaMateriaPrima);
        this.findMateriaPrimaSemi();
      }
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

    this.receta[i][n]=file;

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

  newFormFinal(){
    this.img ={
      url: 'https://img.freepik.com/foto-gratis/resumen-superficie-texturas-muro-piedra-hormigon-blanco_74190-8189.jpg?w=2000',
      name: 'imagenExample',
    }
    this.formRegistro = this.fb.group({
      categoria: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      nombre : ['', [Validators.required]],
      materiaPrimaForm : this.fb.array([
        this.fb.array([
          this.fb.control('', [Validators.required]),
        ]),
      ]),
    });
    console.log(this.materiaPrimaForm.controls[0]);
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

  //agrega un Formarray vinculado a una receta del formulario cuando se ingreso un producto Final
  addReceta(){
    this.materiaPrimaForm.push(this.fb.array([
      this.fb.control('', [Validators.required]),
    ]));
    this.receta.push(Array({
      id:'',
      nombre: '',
    }));
  }

  //agrega un form control al array del formulario cuando se ingreso un producto Final
  addMateriaPrimaFi(index:number){
    let refMateriaPrima = this.materiaPrimaForm.controls[index] as FormArray;
    refMateriaPrima.push(this.fb.control('', [Validators.required]));
    this.receta[index].push({
      id:'',
      nombre: '',
    })
  }
  //Elimina un form control al array del formulario cuando se ingreso un producto Semifinal
  deleteMateriaPrimaFi(index: number){
    //this.materiaPrimaForm.controls.removeAt(index);
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
    
  }

  async findMateriaPrimaSemi(){
    let form = this.materiaPrimaForm;
    let formBuilder = this.fb;
    let refid;
    let lmp = this.listaMateriaPrima;
    let mp = this.materiaPrima;

    this.Producto.materiaPrima.forEach(function(doc,index) {
      if(doc.id._path.segments.length > 2){
        refid = doc.id._path.segments[3];
      }else{
        refid = doc.id._path.segments[1];
      }
      console.log(refid);
      form.push(formBuilder.control(doc.peso, [Validators.required]));
      let documento ={
        id: refid,
        nombre: lmp.filter((alimento) => alimento.id == refid)[0].nombre,
      }
      console.log(documento);
      if(index != 0){
        mp.push(documento)
      }else{
        mp[index]=documento;
      }
    });

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
      arrayMateriaPrima = this.receta;
      arrayMateriaPrima.forEach(function(form,i){
        let recetaForm = {
            presentacion: parseFloat((<HTMLInputElement>document.getElementById('A'+i)).value),
            materiaPrima: form.map((doc, n) => ({
              id: doc.id,
              nombre: doc.nombre,
              peso: parseFloat((<HTMLInputElement>document.getElementById('B'+i+n)).value)
            })),
        }
        refMateriaPrima.push(recetaForm);
      })
      console.log(refMateriaPrima);
      this.producto['receta']=refMateriaPrima;
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

  actualizarProductos(){
    this.producto['materiaPrima'] =  this.materiaPrima.map((doc, index) => ({
      id: doc.id,
      nombre: doc.nombre,
      peso: this.formulario.materiaPrimaForm[index]
    }));;
    this.producto['oldProduct']= this.Producto;

    if(this.imgCapture){
      this.producto.img['imgOld'] = this.Producto.img;
    }


    if(this.Producto.categoria == this.categoria.nombre &&
      this.Producto.id == this.producto.id &&
      this.Producto.img == this.producto.img &&
      this.Producto.nombre == this.producto.nombre){

        this.closeModal();

    }else{

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
          this.producto['materiaPrima']=response.refMateriaPrima;
          this.producto['status']=response.status;
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
 }

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