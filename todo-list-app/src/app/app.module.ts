import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from '@angular/material/sidenav';
import {ReactiveFormsModule, FormsModule, FormBuilder, FormGroup}   from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatInputModule } from '@angular/material';


import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SnackBarComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
