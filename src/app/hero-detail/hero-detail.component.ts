import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { HeroService } from "../hero.service";
import { Hero } from "../hero";

@Component({
  selector: "app-hero-detail",
  templateUrl: "./hero-detail.component.html",
  styleUrls: ["./hero-detail.component.css"]
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.heroService.getHero(id).then(newHero => {
      newHero.subscribe(hero => (this.hero = hero));
    });
  }

  updateHero(name: string): void {
    const id = this.route.snapshot.paramMap.get("id");

    this.heroService.updateHero(id, name);
  }

  goBack(): void {
    this.location.back();
  }
}
