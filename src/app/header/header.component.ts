import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  constructor() { }
  menu = false;
  menuIcon = false;

  ngOnInit(): void {
  }
   
  showMobileMenu(e){
    this.menu = !this.menu;
    this.menuIcon = !this.menuIcon;    
  }
}
