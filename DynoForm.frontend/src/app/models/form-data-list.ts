export class FormDataList {
    title: string;
    columns: string[];
    rows: FormFieldData[];
    constructor(title = '', columns = [], rows = []) {
        this.title = title;
        this.columns = columns;
        this.rows = rows;
    }
}

interface FormFieldData {
    id: string;
    fieldKey: string;
    fieldValue: string;
    formDataId: string;
}