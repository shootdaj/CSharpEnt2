import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import './rxjs-operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private form: FormGroup;
  private subscriptions: Subscription[] = new Array<Subscription>();

  constructor(
    private http: Http,
    private fb: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService) {
    this.getListings();
  }

  private getListings() {
    this.slimLoadingBarService.start();
    this.subscriptions.push(
      this.http.get("http://localhost:9000/api/listings")
        .map(response => response.json())
        .subscribe(inventory => {
          this.setForm(inventory);
          this.slimLoadingBarService.complete();
        },
        err => console.log(err)));
  }

  private setForm(inventory) {
    this.form = this.initForm(inventory);
  }

  private initForm(inventory): FormGroup {
    let form = this.fb.group({
      listings: this.fb.array(this.getListingsFormGroups(inventory.listings))
    });

    this.subscriptions.push(form.valueChanges.debounceTime(1000).subscribe(value => {
      if (this.form.valid) {
        this.saveListings();
      }
    }));

    return form;
  }

  private getListingsFormGroups(listings: any[]): FormGroup[] {
    var returnValue = Array<FormGroup>();

    listings.forEach(listing =>
      returnValue.push(this.fb.group({
        id: [listing.id],
        company: [listing.company, [<any>Validators.required]],
        model: [listing.model, [<any>Validators.required]],
        memoryInGB: [listing.memoryInGB, [<any>Validators.required]],
        cpuSpeedInGHz: [listing.cpuSpeedInGHz, [<any>Validators.required]],
        cores: [listing.cores, [<any>Validators.required]],
        costInDollars: [listing.costInDollars, [<any>Validators.required]]
      }))
    );

    return returnValue;
  }

  public saveListings() {
    if (this.form.valid) {
      this.slimLoadingBarService.start();
      let inventory = this.form.value;
      this.subscriptions.push(this.http.post("http://localhost:9000/api/listings", inventory)
        .map(response => response.json())
        .subscribe(inventory => {
          this.setForm(inventory);
          this.slimLoadingBarService.complete();
        },
        err => console.log(err)));
    }
  }

  public deleteListing(id) {
    let listings = <FormArray>this.form.controls['listings'];

    for (var i = 0; i < listings.length; i++) {
      if (listings.controls[i].value.id === id) {
        listings.removeAt(i);
      }
    }

    this.saveListings();
  }

  public addNewListing() {
    let listings = <FormArray>this.form.controls['listings'];
    listings.push(this.fb.group({
      id: [listings.length + 1],
      company: ["", [<any>Validators.required]],
      model: ["", [<any>Validators.required]],
      memoryInGB: [0, [<any>Validators.required]],
      cpuSpeedInGHz: [0, [<any>Validators.required]],
      cores: [0, [<any>Validators.required]],
      costInDollars: [0, [<any>Validators.required]]
    }));

    this.saveListings();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
