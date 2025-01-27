import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormioRefreshValue } from '@formio/angular';
import { PrismService } from '../services/Prism.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Form } from '../models/form';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss'
})
export class FormBuilderComponent implements AfterViewInit, OnInit {
  private apiUrl = environment.apiUrl;
  @ViewChild('json', { static: true }) jsonElement?: ElementRef;
  @ViewChild('code', { static: true }) codeElement?: ElementRef;
  private formId: string = '';
  public form: Object = {
    components: []
  };
  public refreshForm: EventEmitter<FormioRefreshValue> = new EventEmitter();

  constructor(public prism: PrismService, private http: HttpClient, private route: ActivatedRoute) {
    this.form = { components: [] };
  }
  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id') ?? ''
    if (this.formId) {
      this.http.get<any>(
        `${this.apiUrl}/details?Id=${this.formId}`
      ).subscribe({
        next: (response) => {
          const componentsObj = JSON.parse(response.form.jsonSchema);
          this.form = { ...this.form, components: componentsObj.components };
        },
        error: (error) => {
          console.error('Error loading form:', error);
        }
      });
    }
  }

  onChange(event: any) {
    if (this.jsonElement) {
      console.log("jsonElement")
      this.jsonElement.nativeElement.innerHTML = '';
      this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
    }
    this.refreshForm.emit({
      property: 'form',
      value: event.form
    });
    console.log("niloo form", this.form)
  }

  ngAfterViewInit() {
    this.prism.init();
  }

  onSubmit(event: any) {
    console.log("submit")
    console.log("submit", event)
  }

  OnClickButton() {
    if (this.jsonElement) {
      console.log("jsonElement", this.jsonElement.nativeElement.innerHTML);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });

      const newForm = new Form();
      newForm.Title = 'test title',
        newForm.Description = 'test description',
        newForm.JsonSchema = this.jsonElement.nativeElement.innerHTML;

      this.http.post(`${this.apiUrl}/FormGenerator/add`, newForm, { headers }).subscribe({
        next: (response) => {
          console.log('Form created successfully:', response);
        },
        error: (error) => {
          console.error('Error creating form:', error);
        }
      });
    }
  }
}
