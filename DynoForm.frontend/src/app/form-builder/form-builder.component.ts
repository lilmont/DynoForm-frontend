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
export class FormBuilderComponent implements OnInit, AfterViewInit {
  public model: Form = new Form();
  public form: Object = { components: [] };
  public refreshForm: EventEmitter<FormioRefreshValue> = new EventEmitter();
  private apiUrl = environment.apiUrl;
  private formId: string = '';

  @ViewChild('json', { static: true }) jsonElement?: ElementRef;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private prism: PrismService
  ) { }

  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.formId) {
      this.loadFormDetails(this.formId);
    }
  }

  ngAfterViewInit(): void {
    this.prism.init();
  }

  private loadFormDetails(formId: string): void {
    this.http.get<any>(`${this.apiUrl}/FormGenerator/details?Id=${formId}`)
      .subscribe({
        next: (response) => {
          const componentsObj = JSON.parse(response.form.jsonSchema);
          this.model = {
            Id: response.form.id,
            Title: response.form.title,
            JsonSchema: response.form.jsonSchema
          };
          this.form = { components: componentsObj.components };

          if (this.jsonElement) {
            this.jsonElement.nativeElement.innerHTML = response.form.jsonSchema;
          }
        },
        error: (error) => {
          console.error('Error loading form:', error);
        }
      });
  }

  onChange(event: any): void {
    if (this.jsonElement) {
      this.jsonElement.nativeElement.innerHTML = JSON.stringify(event.form, null, 4);
    }
    this.refreshForm.emit({ property: 'form', value: event.form });
  }

  onSave(): void {
    if (!this.jsonElement || !this.jsonElement.nativeElement.innerHTML || !this.model.Title.trim()) {
      this.showValidationErrors();
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    this.model.JsonSchema = this.jsonElement.nativeElement.innerHTML;

    if (this.isNewForm()) {
      this.createForm(headers);
    } else {
      this.updateForm(headers);
    }
  }

  private isNewForm(): boolean {
    return this.model.Id === '00000000-0000-0000-0000-000000000000';
  }

  private createForm(headers: HttpHeaders): void {
    const newForm = { Title: this.model.Title, JsonSchema: this.model.JsonSchema };

    this.http.post(`${this.apiUrl}/FormGenerator/add`, newForm, { headers }).subscribe({
      next: (response: any) => {
        this.toastr.success('Form created successfully', 'Success').onHidden.subscribe(() => {
          if (response?.formId) {
            window.location.href = `${window.location.origin}${window.location.pathname}/${response.formId}`;
          }
        });
      },
      error: () => {
        this.toastr.error('Error creating form', 'Error');
      }
    });
  }

  private updateForm(headers: HttpHeaders): void {
    this.http.post(`${this.apiUrl}/FormGenerator/edit`, this.model, { headers }).subscribe({
      next: () => {
        this.toastr.success('Form updated successfully', 'Success');
        this.loadFormDetails(this.model.Id);
      },
      error: () => {
        this.toastr.error('Error updating form', 'Error');
      }
    });
  }

  private showValidationErrors(): void {
    if (!this.jsonElement?.nativeElement.innerHTML) {
      this.toastr.error('Form cannot be empty', 'Error');
    }
    if (!this.model.Title.trim()) {
      this.toastr.error('Title cannot be empty', 'Error');
    }
  }
}
