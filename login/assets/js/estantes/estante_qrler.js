const estante3 = JSON.parse(localStorage.getItem('estante3')) || [];

for (const livroInfo of estante3) {
  const livroCard = criarCardLivro(livroInfo);
  document.getElementById("estante3").appendChild(livroCard);
}
function criarCardLivro(livroInfo) {
    const card = document.createElement("div");
    card.classList.add("livro-card");
  
    const infoContainer = document.createElement("div");
  infoContainer.classList.add("livro-info");
  
    const titulo = document.createElement("h2");
    titulo.textContent = livroInfo.title;

  const autor = document.createElement("p");
  autor.textContent = `by: ${livroInfo.authors ? livroInfo.authors.join(', ') : 'Desconhecido'}`;
  
    infoContainer.appendChild(titulo);
    infoContainer.appendChild(autor);

  const capa = document.createElement("img");
  capa.src = livroInfo.imageLinks ? livroInfo.imageLinks.smallThumbnail : 'caminho_para_imagem_padrao.jpg';
  capa.alt = livroInfo.title;

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => {
        removerDaEstante(livroInfo);
        card.remove(); // Remover o card da interface
    });

  card.appendChild(capa);
  card.appendChild(infoContainer);
  card.appendChild(removeButton);

  return card;

function removerDaEstante(livroInfo) {
    const estante3 = JSON.parse(localStorage.getItem('estante3')) || [];
    
    const livroParaRemover = estante3.find(livro => {
    return (
    livro.title === livroInfo.title &&
    livro.authors?.join() === livroInfo.authors?.join()
    );
    });
    
    if (livroParaRemover) {
    estante3.splice(estante3.indexOf(livroParaRemover), 1);
    localStorage.setItem('estante3', JSON.stringify(estante3));
    
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