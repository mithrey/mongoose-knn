import { Component, OnInit, Inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { PointService, AlertService } from '@/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'create.component.html' })
export class CreateComponent implements OnInit {
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
        this.form = this.formBuilder.group({
            name: ['Name', Validators.required],
            x: [0, Validators.required],
            y: [0, Validators.required]
        });
        
    }
    get f() { return this.form.controls; }

    save(){

        this.alertService.clear();
        if (this.form.invalid) {
            return this.alertService.error("Fill all the fields!");
        }

        this.pointService.create( this.f.x.value, this.f.y.value, this.f.name.value)
        .pipe(first())
        .subscribe(
            res  => {
                console.log(res);
                this.alertService.success("Sucessfully created point")
            },
            error => {
                this.alertService.error(error);
            });


    

}

