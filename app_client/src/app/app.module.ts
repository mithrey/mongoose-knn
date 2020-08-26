import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { appRoutingModule } from './app.routing';
import { ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { UpdateComponent } from './update';
import { KnnComponent } from './knn';
import { CreateComponent } from './create';
import { AlertComponent } from './_components';

@NgModule({
    exports: [
        MatAutocompleteModule,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        AlertComponent,
        UpdateComponent,
        KnnComponent,
        CreateComponent

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
          
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };