import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appHeart]',
  standalone: true
})
export class HeartDirective {

  constructor(private el:ElementRef) { }

  @HostListener('click') myClick(){
    this.el.nativeElement.classList.toggle('text-danger')
  }

}
