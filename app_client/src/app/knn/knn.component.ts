import { Component, OnInit, Inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { PointService, AlertService } from '@/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'knn.component.html' })
export class KnnComponent implements OnInit {
    id: string;
    form: FormGroup;
    points: any;
    loading = false;
    constructor(
        private pointService: PointService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.id = this.route.snapshot.queryParams['id'] ;


        this.form = this.formBuilder.group({
            k: [2, Validators.required],
            x: [0, Validators.required],
            y: [0, Validators.required],
            radius: [10, Validators.required]
        });



        
    }
    get f() { return this.form.controls; }

    getKNN(){

        console.log(this.form);
        this.alertService.clear();
        if (this.form.invalid) {
            return this.alertService.error("Fill all the fields!");
        }
        this.loading = true;
        this.pointService.getKNN(this.f.x.value, this.f.y.value, this.f.k.value, this.f.radius.value)
            .pipe(first())
            .subscribe(
                res => {
                    this.loading = false;
                    console.log(res);
                    this.points = res.data;
                },
                error => {
                    this.alertService.error(error);
                });
            }


    

}

