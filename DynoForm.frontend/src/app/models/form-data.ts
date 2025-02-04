export class FormDataRecord {
    Id: string;
    JsonData: string;
    FormId: string;
    data?: string;
    constructor(Id = '00000000-0000-0000-0000-000000000000', JsonData = '', FormId = '') {
        this.Id = Id;
        this.JsonData = JsonData;
        this.FormId = FormId;
    }
}