import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormioRefreshValue } from '@formio/angular';
import { environment } from '../../environments/environment';
import { Form } from '../models/form';
import { ToastrService } from 'ngx-toastr';
import { FormDataRecord } from '../models/form-data';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.component.html',
  styleUrl: './form-viewer.component.scss'
})
export class FormViewerComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  private formId: string = '';
  private formDataId: string | null = '';
  public form: Form = new Form();
  public formData: FormDataRecord = new FormDataRecord();

  public refreshForm: EventEmitter<FormioRefreshValue> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id') ?? ''

    if (this.formId && this.formId !== '') {
      this.http.get<any>(`${this.apiUrl}/FormGenerator/details?Id=${this.formId}`)
        .subscribe({
          next: (response) => {
            const componentsObj = JSON.parse(response.form.jsonSchema);
            this.form = { ...this.form, components: componentsObj.components };
          },
          error: (error) => {
            console.error('Error loading form:', error);
          }
        });
    }

    this.formDataId = this.route.snapshot.paramMap.get('dataId');
    if (this.formDataId) {
      this.loadFormDataDetails(this.formDataId);
    }
  }

  onSubmit(event: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    if (this.isNewFormData()) {
      this.createForm(headers, event);
    } else {
      this.updateForm(headers, event);
    }
  }

  private isNewFormData(): boolean {
    return this.formDataId === null;
  }

  private createForm(headers: HttpHeaders, event: any): void {
    const newFormData = new FormDataRecord();
    newFormData.FormId = this.formId;
    newFormData.JsonData = JSON.stringify(event.data)
    this.http.post(`${this.apiUrl}/FormGenerator/add-data`, newFormData, { headers }).subscribe({
      next: (response: any) => {
        this.toastr.success('Data Submitted successfully', 'Success').onHidden.subscribe(() => {
          if (response?.formDataId) {
            window.location.href = `${window.location.origin}${window.location.pathname}/${response.formDataId}`;
          }
        });
      },
      error: () => {
        this.toastr.error('Error creating form', 'Error');
      }
    });
  }

  private updateForm(headers: HttpHeaders, event: any): void {
    const FormData = new FormDataRecord();
    FormData.FormId = this.formId;
    FormData.JsonData = JSON.stringify(event.data)
    FormData.Id = this.formDataId ?? '';
    if (FormData.Id !== '') {
      this.http.post(`${this.apiUrl}/FormGenerator/edit-data`, FormData, { headers }).subscribe({
        next: () => {
          this.toastr.success('Form updated successfully', 'Success');
          window.location.reload()
        },
        error: () => {
          this.toastr.error('Error updating form', 'Error');
        }
      });
    }
  }

  loadFormDataDetails(formDataId: string): void {
    this.http.get<any>(
      `${this.apiUrl}/FormGenerator/form-data-details?Id=${formDataId}`
    ).subscribe({
      next: (response) => {
        const formDataObj = JSON.parse(response.formData.jsonData);
        this.formData = { ...this.formData, data: formDataObj };
      },
      error: (error) => {
        console.error('Error loading form:', error);
      }
    });
  }
}
