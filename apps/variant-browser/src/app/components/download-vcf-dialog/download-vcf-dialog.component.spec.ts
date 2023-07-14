import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadVcfDialogComponent } from './download-vcf-dialog.component';

describe('DownloadVcfDialogComponent', () => {
  let component: DownloadVcfDialogComponent;
  let fixture: ComponentFixture<DownloadVcfDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadVcfDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadVcfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
