import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from 'src/services/tag.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  title = 'todo-test-app';
  tagsFilter: any[] = []

  searchValue?: string;

  showSearch: boolean = false
  showArchives: boolean = false;

  constructor(private tagService: TagService, private router: Router, private route: ActivatedRoute) {
    
  }

  toggleArchive() {
    this.showArchives = !this.showArchives
  }

  ngOnInit(): void {
    this.fetchTagsFilter()
    this.route.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search') as string
    });
  }

  fetchTagsFilter() {
    this.tagService
      .getAllActiveTag()
      .subscribe(data => this.tagsFilter = data)
  }

  toggleSearch() {
    this.showSearch = !this.showSearch
  }

  handleSearch(e: any) {    
    if(e?.keyCode == 13) {
      e?.preventDefault()
      let value = e?.target?.value;
      if(!value) return;

      const queryParams = {
        search: value
      }
  
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      })

      e.target.value = ''
      this.toggleSearch()
    }
  }
}
