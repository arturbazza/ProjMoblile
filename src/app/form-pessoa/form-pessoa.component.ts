import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from
'@angular/forms';
import { AlertController, IonicModule, ModalController } from
'@ionic/angular';
import { PessoaService } from '../services/PessoaService';
import { CommonModule } from '@angular/common';
@Component({
selector: 'app-form-pessoa',
templateUrl: 'form-pessoa.component.html',
standalone: true,
imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class FormPessoaComponent {
@Input()
modal = false
formGroup: FormGroup = this.fb.group({
nome: ['', Validators.required],
telefone: [''],
email: ['', Validators.email],
hobie: ['']
})
emailToEdit: string | null = null
constructor(private fb: FormBuilder,
private pessoaService: PessoaService,
private alertController: AlertController,
private modalCtrl: ModalController) { }
async salvar() {
if (this.formGroup.valid) {
if (this.emailToEdit) {
this.pessoaService.editar(this.formGroup.value,
this.emailToEdit)
} else {
this.pessoaService.criar(this.formGroup.value)
}
const alert = await this.alertController.create({
header: 'Item salvo',
message: 'Item salvo com sucesso',
buttons: ['OK'],
})
alert.onDidDismiss().then((_) => {this.close()})
await alert.present()
} else {
const alert = await this.alertController.create({
header: 'Formulário inválido',
message: 'Formulário inválido',
buttons: ['OK'],
})
await alert.present()
}
}
cancel() {
return this.modalCtrl.dismiss(null, 'cancel');
}
close() {
this.modalCtrl.dismiss(true, 'close')
}
}
