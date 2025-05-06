const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const booksContainer = document.getElementById('booksContainer')

searchButton.addEventListener('click', (event) => {
    event.preventDefault()
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    fetchBooks(query)

})

function fetchBooks(query) {
    const livros = [
    {
        img: './assets/livro1.jpg',
        titulo: 'Ponto de Inflexão',
        categoria: 'Desenvolvimento Pessoal',
        preco: 69.99,
        desconto: true
    },
    {
        img: './assets/livro2.jpg',
        titulo: 'O poder do aprendizado contínuo',
        categoria: 'Desenvolvimento Pessoal',
        preco: 69.99,
        desconto: true
    },
    {
        img: './assets/livro3.jpg',
        titulo: 'Mais esperto que o Diabo 2',
        categoria: 'Desenvolvimento Pessoal',
        preco: 69.99,
        desconto: false
    },
    {
        img: './assets/livro4.jpg',
        titulo: 'O que se come no céu',
        categoria: 'Desenvolvimento Pessoal',
        preco: 69.99,
        desconto: true
    },
    {
        img: './assets/livro5.jpg',
        titulo: 'Psicologia Financeira',
        categoria: 'Desenvolvimento Pessoal',
        preco: 69.99,
        desconto: true
    },
    {
        img: './assets/livro6.jpg',
        titulo: 'A meta',
        categoria: 'Desenvolvimento Pessoal',
        preco: 69.99,
        desconto: false
    }
]

const livrosFiltrados = livros.filter(item => 
    item.titulo.toLowerCase().includes(query) || 
    item.categoria.toLowerCase().includes(query)
)

if (livrosFiltrados.length === 0) {
    booksContainer.innerHTML = '<h1>Nenhum livro encontrado</h1>'
    return
}

booksContainer.innerHTML = livrosFiltrados.map(item => {
        return `
            <div class="div-card">
                <div class="div-img">
                    <img src=${item.img} alt="capa do livro">
                    <p class="tag-p">frete grátis</p>
                </div>
                <div class="div-texto">
                    <div class="div-titulo">
                        <h1>${item.titulo}</h1>
                        <button>+</button>
                    </div>
                    <h2><a href="">${item.categoria}</a></h2>
                    <p>R$ ${item.preco}</p>
                </div>
            </div>
        
        
        `


}).join('')


}
