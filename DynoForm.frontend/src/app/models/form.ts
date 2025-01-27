export class Form {
    Id: string;
    Title: string;
    Description: string;
    JsonSchema: string;
    constructor(Id = '00000000-0000-0000-0000-000000000000', Title = '', Description = '', JsonSchema = '') {
        this.Id = Id;
        this.Title = Title;
        this.Description = Description;
        this.JsonSchema = JsonSchema;
    }
}