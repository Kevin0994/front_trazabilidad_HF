import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';


@Injectable()

export class ProviderMetodosCrud{

    constructor() { }

    actualizarDatosTablaCosecha(data:any,tabla:any){ //verifica si recibe la nueva cosecha al cerrar el modal
        if(data.status != true){//Edita la cosecha de la tabla
        let foundIndex = tabla.findIndex(obj =>
            obj.nombre == data.nombre && obj.lote == data.lote
        );
        tabla[foundIndex].stock += data.stock;
        return tabla;
        }else{//Inserta la nueva cosecha en la tabla
        tabla.push(data);
        return tabla;
        }
    }

    actualizarDatosTabla(data:any,idOld:any,tabla:any){ //verifica si recibe la nueva cosecha al cerrar el modal
        if(data.status != true){//Edita la cosecha de la tabla
            let foundIndex = tabla.findIndex(obj =>
                obj.id == idOld
            );
            tabla[foundIndex] = data;
            return tabla;
        }else{//Inserta la nueva cosecha en la tabla
            console.log(tabla);
            console.log('Agregando');
            tabla.push(data);
            console.log(tabla);
            return tabla;
        }
    }

    eliminarDatosTabla(id:any,tabla:any){
        let foundIndex = tabla.findIndex(obj =>
            obj.id == id
        );
        tabla.splice(foundIndex,1);
        return tabla;
    }

}