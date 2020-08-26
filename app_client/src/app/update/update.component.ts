import { Component, OnInit, Inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { PointService, AlertService } from '@/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
    id: string;
    form: FormGroup;
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

        this.pointService.getPoint(this.id)
        .pipe(first())
        .subscribe(
            res  => {
                console.log(res);
                this.form = this.formBuilder.group({
                    name: [res.data.name, Validators.required],
                    x: [res.data.x, Validators.required],
                    y: [res.data.y, Validators.required]
                });
            },
            error => {
                this.alertService.error(error);
            });


        
    }
    get f() { return this.form.controls; }

    save(){

        console.log(this.form);
        this.alertService.clear();
        if (this.form.invalid) {
            return this.alertService.error("Fill all the fields!");
        }

        this.pointService.update(this.id, this.f.name.value, this.f.x.value, this.f.y.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/']);
                    
                },
                error => {
                    this.alertService.error(error);
                });
            }


    

}

