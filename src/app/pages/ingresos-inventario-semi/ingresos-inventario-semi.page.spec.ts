import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IngresosInventarioSemiPage } from './ingresos-inventario-semi.page';

describe('IngresosInventarioSemiPage', () => {
  let component: IngresosInventarioSemiPage;
  let fixture: ComponentFixture<IngresosInventarioSemiPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresosInventarioSemiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IngresosInventarioSemiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
