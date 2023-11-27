import { GithubUser } from "./github-user.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load();

        GithubUser.search('GuihCastro').then(user => console.log(user))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if (userExists) {
                throw new Error('Favorito já cadastrado')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
        
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody');

        this.update();
        this.onadd();
    }

    onadd() {
        const addBtn = this.root.querySelector('.search button')
        addBtn.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr();

        this.entries.forEach(user => {
            const row = this.createRow();

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user img').alt = `Foto de perfil de ${user.name}`;
            row.querySelector('.user a').href = `https://github.com/${user.login}`;
            row.querySelector('.user p').textContent = user.name;
            row.querySelector('.user span').textContent = `/${user.login}`;
            row.querySelector('.repositories p').textContent = user.public_repos;
            row.querySelector('.followers p').textContent = user.followers;
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Deseja remover este usuário dos favoritos?')
                if (isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }
    
    createRow() {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/GuihCastro.png" alt="Foto de GuihCastro" />
            <a href="https://github.com/GuihCastro" target="_blank">
                <p>Guilherme Henrique de Castro</p>
                <span>/GuihCastro</span>
            </a>
        </td>
        <td class="repositories">
            <p>33</p>
        </td>
        <td class="followers">
            <p>0</p>
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove();
            })
    }
}