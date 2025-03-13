import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRiceComponent } from './admin-rice.component';

describe('AdminRiceComponent', () => {
  let component: AdminRiceComponent;
  let fixture: ComponentFixture<AdminRiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
