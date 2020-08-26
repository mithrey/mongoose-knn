import { Component, OnInit, Inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { PointService, AlertService } from '@/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {

    points: any;
    constructor(
        private pointService: PointService,
        private alertService: AlertService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        
        this.updateTable();
    }

    updateTable(){
        this.pointService.getPoints()
        .pipe(first())
        .subscribe(
            res => {
                this.points = res.data;
            },
            error => {
                this.alertService.error(error);
            });
    }


    deletePoint(id){

        this.pointService.delete(id)
        .pipe(first())
        .subscribe(
            res  => {
                console.log(res);
                this.updateTable();
            },
            error => {
                this.alertService.error(error);
            });

    }

    updatePoint(id){
        this.router.navigate(['/update'], { queryParams: { id: id } });
        
        
    }

}
