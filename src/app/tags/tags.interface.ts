import { FormArray } from "@angular/forms";
import { TagFormControl, TagList } from "src/interfaces/tag.inteface";



export interface TagSelectorFormType {
    values: FormArray<TagFormControl>
}

export interface TagSelectorValueType {
    values: TagList | null
}
  
