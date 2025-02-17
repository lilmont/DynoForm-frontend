import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Form } from '../models/form';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class FormListComponent implements OnInit {
  public forms: Form[] = [];
  private apiUrl = environment.apiUrl;
  searchQuery: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms(): void {
    this.http.get<Form[]>(`${this.apiUrl}/FormGenerator/list`).subscribe({
      next: (response: any) => {
        console.log("response", response)
        this.forms = response.forms.map((form: any) => new Form(
          form.id,
          form.title,
          '',
          form.createdDate
        ));
      },
      error: (error) => {
        this.toastr.error('Error loading forms', 'Error');
        console.error('Error loading forms:', error);
      }
    });
  }


  filteredForms() {
    return this.forms.filter(form =>
      form.Title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  editForm(formId: string): void {
    this.router.navigate([`/add-form/${formId}`]);
  }

  useForm(formId: string) {
    this.router.navigate([`/view-form/${formId}`]);
  }

  getFormData(formId: string) {
    this.router.navigate([`/form-data-list/${formId}`]);
  }
}
