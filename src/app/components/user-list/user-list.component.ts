import { Component, OnInit } from '@angular/core';

import { NexusService } from '../../services/nexus.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[]

  constructor(
    private nexus: NexusService
  ) { }

  ngOnInit() {
    this.nexus.userList()
        .then(res => {
          console.log('Users:', res);
          this.users = res;
        });
  }

}
