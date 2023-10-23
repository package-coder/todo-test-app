import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from 'src/interfaces/tag.inteface';

@Component({
  selector: 'app-tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.css'],
})
export class TagsFilterComponent implements OnInit {

  @Input() defaultValues?: Tag[] = [];
  @Input() readOnly: boolean = false;

  selectedTagId?: number

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tagId = params.get('tag')
      this.selectedTagId = tagId ? Number(tagId) : undefined
    });
  }

  onClick(tag: Tag) {
    
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
