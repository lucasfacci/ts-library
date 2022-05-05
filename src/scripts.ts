interface Book {
    nome: string;
    autor: string;
    editora: string;
    ano: number;
}

class Form {
    private readonly element: HTMLElement;
    private readonly inputs: HTMLInputElement[] = [];
    private readonly button: HTMLButtonElement;

    public constructor(element: HTMLElement | string) {
        if (typeof element === "string") {
			this.element = document.getElementById(element as string);
		} else {
			this.element = element as HTMLElement;
		}

        for (let i = 0; i < this.element.children[0].children.length; i++) {
            if (i % 2 == 0 && i != this.element.children[0].children.length - 1) {
                this.inputs.push(this.element.children[0].children[i] as HTMLInputElement);
            }
        }

        this.button = this.element.children[0].children[this.element.children[0].children.length - 1] as HTMLButtonElement;

        this.button.addEventListener("click", () => {
            this.createBook();
        });
    }

    public createBook(): void {
        let nullInput: boolean = false;

        this.inputs.forEach(input => {
            if (input.value.trim().length === 0) {
                nullInput = true;
            }
        })
        
        if (nullInput == false) {
            if (isNaN(parseInt(this.inputs[3].value)) || parseInt(this.inputs[3].value) <= 0) {
                alert('Error: O campo "Ano" deve ser um número ou um número maior que 0!')
            } else {
                const book: Book = {
                    nome: this.inputs[0].value.normalize().trim(),
                    autor: this.inputs[1].value.normalize().trim(),
                    editora: this.inputs[2].value.normalize().trim(),
                    ano: parseInt(this.inputs[3].value)
                }
    
                fetch("https://academico.espm.br/testeapi/livro/criar",
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(book)
                })
                .then(response => response.json())
                .then(() => {
                    this.inputs[0].value = "";
                    this.inputs[1].value = "";
                    this.inputs[2].value = "";
                    this.inputs[3].value = "";

                    this.refreshElements();
                })
                .catch(error => {
                    alert(`Error: ${error}`);
                })
            }
        } else {
            alert("Error: Todos os campos devem ser preenchidos!")
        }
    }

    public refreshElements() {
        let data: HTMLDivElement = document.querySelector('#data');
        while (data.lastChild) {
            data.removeChild(data.lastChild);
        }
        new Data("data");
    }
}

class Data {
    private readonly element: HTMLElement;

    public constructor(element: HTMLElement | string) {
        if (typeof element === "string") {
			this.element = document.getElementById(element as string);
		} else {
			this.element = element as HTMLElement;
		}

        this.getMethod();
    }

    public getMethod(): void {
        fetch("https://academico.espm.br/testeapi/livro/listar",
        {
            method: "GET"
        })
        .then(response => response.json())
        .then(books => {
            this.listBooks(books);
        })
        .catch(error => {
            alert(`Error: ${error}`);
        })
    }

    public listBooks(books): void {
        books.forEach(book => {
            let div: HTMLDivElement = document.createElement("div");
            let id: HTMLElement = document.createElement("b");
            let name: HTMLHeadingElement = document.createElement("h2");
            let information: HTMLDivElement = document.createElement("div");
            let br: HTMLBRElement = document.createElement("br");
            let button: HTMLButtonElement = document.createElement("button");
            let line: HTMLHRElement = document.createElement("hr");

            id.innerHTML = `Id ${book.id}`;
            name.innerHTML = book.nome;
            information.innerHTML = `${book.autor} / ${book.editora} / ${book.ano}`;
            button.innerHTML = "Excluir";

            button.addEventListener("click", () => {
                fetch(`https://academico.espm.br/testeapi/livro/excluir/${book.id}`,
                {
                    method: "GET"
                })
                .then(response => response.json())
                .then(() => {
                    let data: HTMLDivElement = document.querySelector('#data');
                    while (data.lastChild) {
                        data.removeChild(data.lastChild);
                    }
                    this.getMethod();
                })
                .catch(error => {
                    alert(`Error: ${error}`);
                })
            });

            div.appendChild(id);
            div.appendChild(name);
            div.appendChild(information);
            div.appendChild(br);
            div.appendChild(button);
            div.appendChild(line);

            document.querySelector("#data").appendChild(div);
        })
    }
}

let form = new Form("form");
let data = new Data("data");