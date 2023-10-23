import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { snakeCase } from 'lodash';
import { TagService } from 'src/services/tag.service';

@Component({
  selector: 'app-tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.css'],
})
export class TagsFilterComponent implements OnInit {

  @Input() defaultValues: any = [];
  @Input() readOnly: boolean = false;

  selectedTagId: any

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tagId = params.get('tag')
      this.selectedTagId = tagId
    });
  }

  onClick(tag?: any) {
    
    const queryParams = tag && this.selectedTagId != tag.id ? {
      tag: tag.id
    } : undefined

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    })
  }
}
