import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalFabricacionPage } from './modal-fabricacion.page';

describe('ModalFabricacionPage', () => {
  let component: ModalFabricacionPage;
  let fixture: ComponentFixture<ModalFabricacionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFabricacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFabricacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
