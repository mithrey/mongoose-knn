import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { UpdateComponent } from './update';
import { KnnComponent } from './knn';
import { CreateComponent } from './create';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'update', component: UpdateComponent },
    { path: 'knn', component: KnnComponent },
    { path: 'create', component: CreateComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);