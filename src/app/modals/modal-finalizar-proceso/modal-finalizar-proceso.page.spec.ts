import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalFinalizarProcesoPage } from './modal-finalizar-proceso.page';

describe('ModalFinalizarProcesoPage', () => {
  let component: ModalFinalizarProcesoPage;
  let fixture: ComponentFixture<ModalFinalizarProcesoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFinalizarProcesoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFinalizarProcesoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
