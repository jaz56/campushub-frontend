import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDemandesComponent } from './mes-demandes';

describe('MesDemandesComponent', () => {
  let component: MesDemandesComponent;
  let fixture: ComponentFixture<MesDemandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesDemandesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MesDemandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
