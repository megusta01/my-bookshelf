// Carregar a estante do localStorage
const estante = JSON.parse(localStorage.getItem('estante')) || [];

// Iterar sobre os livros na estante e exibi-los na página
for (const livroInfo of estante) {
  const livroCard = criarCardLivro(livroInfo);
  document.getElementById("estante").appendChild(livroCard);
}

// Função para criar um card de livro
function criarCardLivro(livroInfo) {
  const card = document.createElement("div");
  card.classList.add("livro-card");

  //conteiner de informaçoes 
  const infoContainer = document.createElement("div");
infoContainer.classList.add("livro-info");

// Título do livro
  const titulo = document.createElement("h2");
  titulo.textContent = livroInfo.title;

  // Autor do livro
  const autor = document.createElement("p");
  autor.textContent = `by: ${livroInfo.authors ? livroInfo.authors.join(', ') : 'Desconhecido'}`;
  
  // Adicione os elementos ao card
    infoContainer.appendChild(titulo);
    infoContainer.appendChild(autor);

  // Capa do livro
  const capa = document.createElement("img");
  capa.src = livroInfo.imageLinks ? livroInfo.imageLinks.smallThumbnail : 'caminho_para_imagem_padrao.jpg';
  capa.alt = livroInfo.title;

    // Botão de remoção
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => {
        removerDaEstante(livroInfo);
        card.remove(); // Remover o card da interface
    });

  // elementos do card
  card.appendChild(capa);
  card.appendChild(infoContainer);
  card.appendChild(removeButton);

  return card;


  // Função para remover um livro da estante por título e autor
function removerDaEstante(livroInfo) {
const estante = JSON.parse(localStorage.getItem('estante')) || [];

const livroParaRemover = estante.find(livro => {
return (
livro.title === livroInfo.title &&
livro.authors?.join() === livroInfo.authors?.join()
);
});

if (livroParaRemover) {
estante.splice(estante.indexOf(livroParaRemover), 1);
localStorage.setItem('estante', JSON.stringify(estante));

// Remover o card da interface
const cards = document.querySelectorAll('.livro-card');
cards.forEach(card => {
const cardTitle = card.querySelector('h2').textContent;
const cardAuthor = card.querySelector('p').textContent.replace('Autor: ', '');
if (
  cardTitle === livroInfo.title &&
  cardAuthor === livroInfo.authors?.join(', ')
) {
  card.remove();
}
});
}
}
}