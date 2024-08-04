import { Injectable } from '@angular/core';
import { DatabaseService } from './DatabaseService';
import { Pessoa } from '../model/Pessoa';

const PESSOAS_KEY = "pessoas";

@Injectable({
    providedIn: 'root'
})
export class PessoaService {
    constructor(private databaseService: DatabaseService) { }

    async criar(pessoa: Pessoa) {
        const pessoas = await this.listar();
        if (pessoas) {
            pessoas.push(pessoa);
            this.databaseService.set(PESSOAS_KEY, pessoas);
        } else {
            this.databaseService.set(PESSOAS_KEY, [pessoa]);
        }
    }

    listar(): Promise<Pessoa[] | null> {
        return this.databaseService.get<Pessoa[]>(PESSOAS_KEY);
    }

    async editar(pessoa: Pessoa, email: string) {
        const pessoas = await this.listar();
        if (pessoas) {
            const index = pessoas.findIndex(p => p.email === email);
            if (index >= 0) {
                pessoas.splice(index, 1, pessoa);
                this.databaseService.set(PESSOAS_KEY, pessoas);
            }
        }
    }

    async get(email: string): Promise<Pessoa | null> {
        const pessoas = await this.listar();
        if (pessoas) {
            const index = pessoas.findIndex(pessoa => pessoa.email === email);
            if (index >= 0) {
                return pessoas[index];
            }
            return null;
        } else {
            return null;
        }
    }

    async delete(email: string): Promise<boolean> {
        const pessoas = await this.listar();
        if (pessoas) {
            const index = pessoas.findIndex(pessoa => pessoa.email === email);
            if (index >= 0) {
                pessoas.splice(index, 1);
                this.databaseService.set(PESSOAS_KEY, pessoas);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async findByNome(nome: string): Promise<Pessoa[]> {
        const pessoas = await this.listar();
        const filtered = pessoas?.filter(pessoa =>
            pessoa.nome.toLocaleLowerCase().startsWith(nome.toLocaleLowerCase())
        );
        if (filtered) {
            return filtered;
        } else {
            return [];
        }
    }
}
