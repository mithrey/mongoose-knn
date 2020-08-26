import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({ providedIn: 'root' })
export class PointService {
    constructor(private http: HttpClient) { }

    getPoints() {
        return this.http.get<any>('/api/points');
    }

    getPoint(id) {
        return this.http.get<any>(`api/points/${id}`);
    }

    delete(id) {
        return this.http.delete<any>(`api/points/${id}`);
    }

    update(id, name, x, y){
        return this.http.put<any>(`api/points/${id}`,{name, x, y});
    }

    getKNN(x, y, k, radius){
        return this.http.post<any>(`api/knn`,{x, y, k, radius});
    }

    create(x, y, name){
        return this.http.post<any>(`api/points`,{x, y, name});
    }
}