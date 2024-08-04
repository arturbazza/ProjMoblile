import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ViewDidEnter } from '@ionic/angular';
import { FormPessoa } from '../components/form-pessoa.component';
import { PessoaService } from '../services/PessoaService';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
    standalone: true,
    imports: [IonicModule, FormPessoa],
})
export class Tab1Page implements ViewDidEnter {
    @ViewChild(FormPessoa)
    formPessoa!: FormPessoa;

    constructor(
        private pessoaService: PessoaService,
        private activedRouter: ActivatedRoute
    ) { }

    ionViewDidEnter(): void {
        this.formPessoa.emailToEdit = null;
        const email = this.activedRouter.snapshot.paramMap.get("email");
        if (email) {
            this.pessoaService.get(email).then(pessoa => {
                if (pessoa) {
                    this.formPessoa.formGroup.patchValue(pessoa);
                    this.formPessoa.emailToEdit = email;
                }
            });
        }
    }
}
