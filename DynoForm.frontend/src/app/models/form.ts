export class Form {
    Id: string;
    Title: string;
    JsonSchema: string;
    CreatedDate?: string;
    components?: Array<any>
    constructor(Id = '00000000-0000-0000-0000-000000000000', Title = '', JsonSchema = '', CreatedDate = '', components = undefined) {
        this.Id = Id;
        this.Title = Title;
        this.JsonSchema = JsonSchema;
        this.CreatedDate = CreatedDate;
        this.components = components;
    }
}