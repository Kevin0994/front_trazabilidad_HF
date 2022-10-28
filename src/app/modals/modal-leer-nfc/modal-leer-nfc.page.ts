import { Component, OnInit, Input } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';

@Component({
  selector: 'app-modal-leer-nfc',
  templateUrl: './modal-leer-nfc.page.html',
  styleUrls: ['./modal-leer-nfc.page.scss'],
})
export class ModalLeerNFCPage implements OnInit {
  @Input() listInventory: any = [];
  productFound: any = {};
  constructor(private nfc: NFC, private ndef: Ndef) {}

  ngOnInit() {
    this.readNFC();
  }

  readNFC() {
    console.log(this.listInventory);
    this.nfc.addNdefListener().subscribe((data) => {
      let payload = this.nfc
        .bytesToString(data.tag.ndefMessage[0].payload)
        .substring(3);
      let findProduct = this.listInventory.filter(
        (product) => product.id === payload
      );
      this.productFound = findProduct[0];
    });
  }

  test() {
    let findProduct = this.listInventory.filter(
      (product) => product.id === 'V2CGcBO0py7rXCEJK7Rc'
    );
    this.productFound = findProduct[0];
  }
}
