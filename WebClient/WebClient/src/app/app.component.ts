import { Component, ViewChild, Injectable, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import './rxjs-operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private form: FormGroup;

  constructor(
    private http: Http,
    private fb: FormBuilder) {
    this.getListings();
  }

  private getListings() {
    this.http.get("http://localhost:9000/api/listings")
      .map(response => response.json())
      .subscribe(inventory => {
        this.form = this.getForm(inventory);
      });
  }

  private getForm(inventory): FormGroup {
    return this.fb.group({
      listings: this.fb.array(this.getListingsFormGroups(inventory.Listings))
    });
  }

  private getListingsFormGroups(listings: any[]): FormGroup[] {
    var returnValue = Array<FormGroup>();

    listings.forEach(listing =>
      returnValue.push(this.fb.group({
        company: [listing.Company, [<any>Validators.required]],
        model: [listing.Model, [<any>Validators.required]],
        memoryInGB: [listing.MemoryInGB, [<any>Validators.required]],
        cpuSpeedInGHz: [listing.CPUSpeedInGHz, [<any>Validators.required]],
        cores: [listing.Cores, [<any>Validators.required]],
        costInDollars: [listing.CostInDollars, [<any>Validators.required]]        
      }))
    );

    return returnValue;
  }
}
