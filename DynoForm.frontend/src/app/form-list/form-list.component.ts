import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Form } from '../models/form';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  public forms: Form[] = [];
  private apiUrl = environment.apiUrl;

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

  editForm(formId: string): void {
    this.router.navigate([`/add-form/${formId}`]);
  }

  useForm(formId: string) {

  }
}
