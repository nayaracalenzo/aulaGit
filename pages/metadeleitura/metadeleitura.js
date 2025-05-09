const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const booksContainer = document.getElementById('booksContainer')
const metaLivros = document.getElementById('metaLivros')
const formLivro = document.getElementById('formLivro')

searchButton.addEventListener('click', (event) => {
    event.preventDefault()
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    fetchBooks(query)

})

formLivro.addEventListener('check', (event) => {
    event.preventDefault()
    const title = document.getElementById('tituloLivro')
    const author_name = document.getElementById('autorLivro')
    const capa = document.getElementById('imgLivro')

    salvarLivrosLocais({title, author_name, capa})
    alert('Livro salvo com sucesso')
    formLivro.reset()
})

function salvarLivrosLocais (livro) {
    const livrosSalvos = JSON.parse(localStorage.getItem('livrosPersonalizados')) || [];
    livrosSalvos.push()
    localStorage.setItem('livrosPersonalizados', JSON.stringify(livrosSalvos))
}

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
            <button onclick="abrirModal('${capa}')" class="cursor-pointer absolute top-0 left-2 z-95"><i class="fa-solid fa-bookmark text-blue-500" style="font-size:24px;"capa='${capa}'></i></button>
            <button onclick="removerLivro('${capa}')" class="group-hover:block hidden absolute z-95 right-2 top-2 cursor-pointer w-10 h-10 rounded-full bg-red-700"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
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
            
            <button onclick="abrirModal('${capa}')" class="cursor-pointer absolute top-0 left-2 z-95"><i class="fa-solid fa-bookmark text-blue-500" style="font-size:24px;" capa='${capa}'></i></button>

            <button onclick="removerLivro('${capa}')" class="group-hover:block hidden absolute z-95 right-2 top-2 cursor-pointer w-10 h-10 rounded-full bg-red-700"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
            <div class="div-img">
                <img src='${capa}' alt="capa do livro" class="w-[150px] h-auto">
            </div>
        </div> 
    ` 
    });
}


function alterarStatus (select) {
    const cores = ['blue', 'yellow', 'green']
    select.classList.remove(...cores.map(cor => `bg-${cor}-500`))
    select.classList.add(`bg-${select.value}-500`)

    const capa = select.getAttribute('capa')

    const icone = document.querySelector(`.fa-bookmark[capa='${capa}']`)
    icone.classList.remove(...cores.map(cor => `text-${cor}-500`))
    icone.classList.add(`text-${select.value}-500`)
}

function removerLivro (capa) {
    const livrosSalvos = JSON.parse(localStorage.getItem('metaLivros')) || [];
    const novaLista = livrosSalvos.filter(capaSalva => capaSalva !== capa)
    localStorage.setItem('metaLivros', JSON.stringify(novaLista));

    carregarLivrosSalvos()
}

function abrirModal (capa) {
    document.getElementById("mudarDisplay").style.display = 'block'
    document.body.classList.add('overflow-y-hidden')

    const statusLeitura = document.getElementById("statusLeitura")
    statusLeitura.setAttribute('capa', capa)
}

function fecharModal () {
    document.getElementById("mudarDisplay").style.display = 'none'
    document.body.classList.remove('overflow-y-hidden')
}