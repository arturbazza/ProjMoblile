import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { PessoaService } from '../services/PessoaService';
import { Router } from '@angular/router';
import { Pessoa } from '../model/Pessoa';
import { FormPessoa } from '../components/form-pessoa.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, distinctUntilChanged, debounceTime } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class Tab2Page {
[x: string]: any;
  pessoas: Pessoa[] = [];
  loading = false;
  filterForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private pessoaService: PessoaService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      nome: ['']
    });
  }

  ionViewDidEnter() {
    this.listar();
    this.initializeFilter();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async listar() {
    this.loading = true;
    const loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await loading.present();

    this.pessoaService.listar().then((data) => {
      if (data) {
        this.pessoas = data;
      }
      this.loading = false;
      loading.dismiss();
    }).catch(error => {
      console.error(error);
      this.loading = false;
      loading.dismiss();
    });
  }

  async deletar(pessoa: Pessoa) {
    const deletado = await this.pessoaService.delete(pessoa.email);
    if (deletado) {
      this.listar();
      const toast = await this.toastController.create({
        message: 'Pessoa deletada com sucesso',
        duration: 1500,
        position: 'top'
      });

      await toast.present();
    }
  }

  async criarNovo() {
    const modal = await this.modalCtrl.create({
      component: FormPessoa,
      componentProps: { modal: true }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'close') {
      this.listar();
    }
  }

  async filtrar(nome: string) {
    const pessoas = await this.pessoaService.findByNome(nome);
    this.pessoas = pessoas;
  }

  initializeFilter() {
    const sub = this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => this.filtrar(value.nome));
    this.subscriptions.push(sub);
  }
}
