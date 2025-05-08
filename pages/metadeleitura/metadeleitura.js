const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const booksContainer = document.getElementById('booksContainer')
const metaLivros = document.getElementById('metaLivros')

searchButton.addEventListener('click', (event) => {
    event.preventDefault()
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    fetchBooks(query)

})

function fetchBooks(query) {
    booksContainer.innerHTML = `
        <img src="https://themoonjoy.com/wp-content/uploads/2019/03/loading.gif" alt="carregando" class="w-[50px]">
    `
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&language=por`)
    .then(res => res.json())
    .then(dados => {
        
        
        const livrosFiltrados = dados.docs.filter(item => 
        item.language.includes('por') && !item.language.includes('eng')
        ).slice(0,10);

        if (livrosFiltrados.length === 0) {
            booksContainer.innerHTML = '<h1>Nenhum livro encontrado</h1>'
            return
        }
        
        booksContainer.innerHTML = livrosFiltrados.map(item => {
            const urlImagem = item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : `https://placehold.co/150x200@2x?text=${item.title.slice(0,30)}`
        return `
            <div class="div-card">
                <div class="div-img">
                    <img src='${urlImagem}' alt="capa do livro" class="w-[150px] h-auto mb-5">
                    <p class="tag-p text-xs">frete grátis</p>
                </div>
                <div class="div-texto">
                    <div class="div-titulo">
                        <h1 class="truncate text-xs font-bold w-full">${item.title}</h1>
                    </div>
                    <h2 class="my-2 ">${item.author_name}</h2>
                    <button onclick="adicionarLivro('${urlImagem}')" class="rounded-md flex justify-center w-full h-6 p-1 border border-blue-500">
                    <i class="text-blue-500 fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        
        `}).join('')
    })
    .catch( erro => {
        console.log('Erro ao buscar livros:', erro)
        booksContainer.innerHTML = '<p>Erro ao buscar livros</p>'
    })
}

function adicionarLivro (capa) {
    const livrosSalvos = JSON.parse(localStorage.getItem('metaLivros')) || [];
    if (!livrosSalvos.includes(capa)) {
         metaLivros.innerHTML += `
        <div class="div-card group w-[60px] relative">
            <button onclick="removerLivro('${capa}')" class="group-hover:block hidden absolute z-99 right-2 top-2 cursor-pointer w-10 h-10 rounded-full bg-red-700"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
            <div class="div-img">
                <img src='${capa}' alt="capa do livro" class="w-[150px] h-auto">
            </div>
        </div> 
    ` 
    livrosSalvos.push(capa)
}
    localStorage.setItem('metaLivros', JSON.stringify(livrosSalvos))
}

document.addEventListener('DOMContentLoaded', carregarLivrosSalvos)

function carregarLivrosSalvos () {
    const livrosSalvos = JSON.parse(localStorage.getItem('metaLivros')) || [];
    
    metaLivros.innerHTML = ''

    livrosSalvos.forEach( capa => {

        metaLivros.innerHTML += `
        <div class="div-card w-[60px] relative group">
            <button onclick="removerLivro('${capa}')" class="group-hover:block hidden absolute z-99 right-2 top-2 cursor-pointer w-10 h-10 rounded-full bg-red-700"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
            <div class="div-img">
                <img src='${capa}' alt="capa do livro" class="w-[150px] h-auto">
            </div>
        </div> 
    ` 
    });
}

function removerLivro (capa) {
    const livrosSalvos = JSON.parse(localStorage.getItem('metaLivros')) || [];
    const novaLista = livrosSalvos.filter(capaSalva => capaSalva !== capa)
    localStorage.setItem('metaLivros', JSON.stringify(novaLista));

    carregarLivrosSalvos()
}
