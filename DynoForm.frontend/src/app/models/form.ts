export class Form {
    Id: string;
    Title: string;
    JsonSchema: string;
    constructor(Id = '00000000-0000-0000-0000-000000000000', Title = '', JsonSchema = '') {
        this.Id = Id;
        this.Title = Title;
        this.JsonSchema = JsonSchema;
    }
}