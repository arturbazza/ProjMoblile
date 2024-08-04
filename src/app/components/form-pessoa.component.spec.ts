import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormPessoa } from './form-pessoa.component';

describe('FormPessoaComponent', () => {
  let component: FormPessoa;
  let fixture: ComponentFixture<FormPessoa>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormPessoa ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormPessoa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
