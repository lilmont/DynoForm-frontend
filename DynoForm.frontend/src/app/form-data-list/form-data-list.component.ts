import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormDataList } from '../models/form-data-list';

@Component({
  selector: 'app-form-data-list',
  templateUrl: './form-data-list.component.html',
  styleUrl: './form-data-list.component.scss'
})

export class FormDataListComponent implements OnInit {
  formId!: string;
  formTitle: string = '';
  data: FormDataList | null = null;
  groupedRows: { [key: string]: string }[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.formId = params.get('id') || '';
      if (this.formId) {
        this.fetchData();
      }
    });
  }

  fetchData(): void {
    this.http.get<any>(`${this.apiUrl}/FormGenerator/form-data-list?Id=${this.formId}`).subscribe(
      (response) => {
        this.data = response;
        this.formTitle = this.data?.title ?? '';
        this.groupRows();
      },
      (error) => {
        console.error('Error fetching form data:', error);
      }
    );
  }

  groupRows(): void {
    if (this.data) {
      const grouped: { [key: string]: string }[] = [];
      const groupedByFormDataId = this.data.rows.reduce((acc: any, row: any) => {
        acc[row.formDataId] = acc[row.formDataId] || {};
        acc[row.formDataId][row.fieldKey] = row.fieldValue;
        return acc;
      }, {} as { [key: string]: { [key: string]: string } });

      this.groupedRows = Object.values(groupedByFormDataId);
    }
  }

  private apiUrl = environment.apiUrl;
}
