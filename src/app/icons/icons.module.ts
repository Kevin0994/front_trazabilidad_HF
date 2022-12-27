import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilkIconComponent } from './milk-icon/milk-icon.component';
import { BoxIconComponent } from './box-icon/box-icon.component';



@NgModule({
  declarations: [
    MilkIconComponent,
    BoxIconComponent
  ],
  exports: [
    MilkIconComponent,
    BoxIconComponent
  ],
  imports: [
    CommonModule
  ]
})
export class IconsModule { }
