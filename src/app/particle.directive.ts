import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClickerService } from './clicker/clicker.service';
import { ScrollService } from './scroll-service.service';

@Directive({
  selector: '[appParticle]',
})
export class ParticleDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private clickerService: ClickerService,
    private scrollService: ScrollService
  ) {}

  private scrollValue: number = 0;

  ngOnInit() {
    this.scrollService.scroll$.subscribe((scroll) => {
      this.scrollValue = scroll
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    // Create a particle for the debuxPerClick value
    this.createDebuxPerClickParticle(event.clientX, event.clientY, this.clickerService.calculateTotalDebuxPerClick() * this.clickerService.perClickMultiplier);

    // Create a burst of particles as before
    const particleCount = 1;

    for (let i = 0; i < particleCount; i++) {
      const particle = this.renderer.createElement('div');

      // Dynamically load SVG file
      this.http.get('assets/img/debug.svg', { responseType: 'text' }).subscribe((svgContent) => {
        this.renderer.addClass(particle, 'particle');

        // Use innerHTML to set the content with the loaded SVG
        particle.innerHTML = svgContent;

        const offsetX = event.clientX - 20;
        const offsetY = event.clientY - 130 + this.scrollValue;

        // Set initial velocity and rotation
        const initialVelocityX = (Math.random() - 0.5) * 5; // Random horizontal velocity (slower)
        const initialVelocityY = -Math.random(); // Weaker upward vertical velocity
        const rotation = Math.random() * 360;

        this.renderer.setStyle(particle, 'transform', `rotate(${rotation}deg) scale(2)`); // Adjust the scale for a larger image
        this.renderer.setStyle(particle, 'width', '40px'); // Adjust the width of the particle
        this.renderer.setStyle(particle, 'height', '57px'); // Adjust the height of the particle

        this.renderer.setStyle(particle, 'position', 'absolute');
        this.renderer.setStyle(particle, 'left', `${offsetX}px`);
        this.renderer.setStyle(particle, 'top', `${offsetY}px`);

        this.renderer.appendChild(this.el.nativeElement, particle);

        // Add animation to the particle after it's added to the DOM
        let animationFrameId: number;
        const animateParticle = (timestamp: number) => {
          const timeDelta = timestamp - startTime;
          const positionX = offsetX + initialVelocityX * timeDelta * 0.02; // Adjust the multiplier as needed
          const positionY = offsetY + initialVelocityY * timeDelta * 0.02 + 0.5 * 1.62 * (timeDelta * 0.02) ** 2; // Weaker gravity simulation

          this.renderer.setStyle(particle, 'left', `${positionX}px`);
          this.renderer.setStyle(particle, 'top', `${positionY}px`);

          // Adjust fading speed
          const opacity = Math.max(0, 1.4 - timeDelta * 0.001);
          this.renderer.setStyle(particle, 'opacity', `${opacity}`);

          if (positionY < window.innerHeight && opacity > 0) {
            animationFrameId = requestAnimationFrame(animateParticle);
          } else {
            cancelAnimationFrame(animationFrameId);
            this.renderer.removeChild(this.el.nativeElement, particle);
          }
        };

        const startTime = performance.now();
        animationFrameId = requestAnimationFrame(animateParticle);

        // Remove the particle from the DOM after the animation duration
        setTimeout(() => {
          cancelAnimationFrame(animationFrameId);
          this.renderer.removeChild(this.el.nativeElement, particle);
        }, 5000); // Adjust the duration as needed
      });
    }
    
  }

  private createDebuxPerClickParticle(cursorX: number, cursorY: number, debuxPerClick: number): void {
    const debuxPerClickParticle = this.renderer.createElement('div');
    this.renderer.addClass(debuxPerClickParticle, 'debux-per-click-particle');
    this.renderer.setProperty(debuxPerClickParticle, 'innerText', `+${debuxPerClick}`);
    this.renderer.setStyle(debuxPerClickParticle, 'font-family', "'IBM Plex Mono', monospace");
    this.renderer.setStyle(debuxPerClickParticle, 'font-size', '24px');

    this.renderer.setStyle(debuxPerClickParticle, 'position', 'absolute');
    this.renderer.setStyle(debuxPerClickParticle, 'left', `${cursorX - 20}px`);
    this.renderer.setStyle(debuxPerClickParticle, 'top', `${cursorY}px`);

    this.renderer.appendChild(this.el.nativeElement, debuxPerClickParticle);

    // Add animation to the debuxPerClick particle
    let animationFrameId: number;
    const animateDebuxPerClickParticle = (timestamp: number) => {
      const timeDelta = timestamp - debuxStartTime;
      const positionY = cursorY - 110 - timeDelta * 0.1  + this.scrollValue;

      this.renderer.setStyle(debuxPerClickParticle, 'top', `${positionY}px`);

      // Adjust fading speed
      const opacity = Math.max(0, 1 - timeDelta * 0.001);
      this.renderer.setStyle(debuxPerClickParticle, 'opacity', `${opacity}`);

      if (positionY > 0 && opacity > 0) {
        animationFrameId = requestAnimationFrame(animateDebuxPerClickParticle);
      } else {
        cancelAnimationFrame(animationFrameId);
        this.renderer.removeChild(this.el.nativeElement, debuxPerClickParticle);
      }
    };

    const debuxStartTime = performance.now();
    animationFrameId = requestAnimationFrame(animateDebuxPerClickParticle);
  }
}
