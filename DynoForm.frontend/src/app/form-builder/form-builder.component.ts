import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormioModule, FormioRefreshValue } from '@formio/angular';
import { PrismService } from '../services/Prism.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Form } from '../models/form';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss'
})
export class FormBuilderComponent implements AfterViewInit, OnInit {
  public model: Form = new Form();
  private apiUrl = environment.apiUrl;
  @ViewChild('json', { static: true }) jsonElement?: ElementRef;
  @ViewChild('code', { static: true }) codeElement?: ElementRef;
  private formId: string = '';
  public form: Object = {
    components: []
  };
  public refreshForm: EventEmitter<FormioRefreshValue> = new EventEmitter();

  constructor(public prism: PrismService, private http: HttpClient, private route: ActivatedRoute, private toastr: ToastrService) {
    this.form = { components: [] };
  }
  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id') ?? ''

    if (this.formId) {
      this.http.get<any>(
        `${this.apiUrl}/FormGenerator/details?Id=${this.formId}`
      ).subscribe({
        next: (response) => {
          const componentsObj = JSON.parse(response.form.jsonSchema);
          this.model.Id = response.form.id;
          this.model.Title = response.form.title;
          this.form = { ...this.form, components: componentsObj.components };
          if (this.jsonElement)
            this.jsonElement.nativeElement.innerHTML = response.form.jsonSchema;
        },
        error: (error) => {
          console.error('Error loading form:', error);
        }
      });
    }
  }

  onChange(event: any) {
    if (this.jsonElement) {
      this.jsonElement.nativeElement.innerHTML = '';
      this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
    }
    this.refreshForm.emit({
      property: 'form',
      value: event.form
    });
  }

  ngAfterViewInit() {
    this.prism.init();
  }

  OnSaveButton() {
    if (this.jsonElement) {
      if (this.jsonElement.nativeElement.innerHTML === ''
        || this.model.Title === ''
      ) {
        if (this.jsonElement.nativeElement.innerHTML === '')
          this.toastr.error('Form cannot be empty', 'Error');
        if (this.model.Title === '')
          this.toastr.error('Title cannot be empty', 'Error');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
      if (this.model.Id === '00000000-0000-0000-0000-000000000000') {
        const newForm = new Form();
        newForm.Title = this.model.Title,
          newForm.JsonSchema = this.jsonElement.nativeElement.innerHTML;

        this.http.post(`${this.apiUrl}/FormGenerator/add`, newForm, { headers }).subscribe({
          next: (response: any) => {
            this.toastr.success('Form created successfully', 'Success');
            if (response?.formId) {
              window.location.href = `${window.location.origin}${window.location.pathname}/${response.formId}`;
            }
          },
          error: (error) => {
            this.toastr.error('Error creating form:', 'Error');
          }
        });
      }
      else {
        this.model.JsonSchema = this.jsonElement.nativeElement.innerHTML;
        this.http.post(`${this.apiUrl}/FormGenerator/edit`, this.model, { headers }).subscribe({
          next: (response) => {
            this.toastr.success('Form updated successfully', 'Success');
            this.loadFormDetails();
          },
          error: (error) => {
            this.toastr.error('Error creating form:', 'Error');
          }
        });
      }
    }
  }

  loadFormDetails() {
    this.http.get<any>(`${this.apiUrl}/details?Id=${this.model.Id}`).subscribe({
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
