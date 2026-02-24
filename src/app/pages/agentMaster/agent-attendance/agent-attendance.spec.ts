import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAttendance } from './agent-attendance';

describe('AgentAttendance', () => {
  let component: AgentAttendance;
  let fixture: ComponentFixture<AgentAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentAttendance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentAttendance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
