import { FormControl } from "@angular/forms"

export interface Tag {
    id?: number
    name: string
    isArchived: boolean
}

export interface TagFormControl extends FormControl<Tag | null> {}
  
export interface TagList extends Array<Tag> {}