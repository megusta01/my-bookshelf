function listen(e) {
    const bookCard = e.target.parentElement;
    const bookDescription = bookCard.children[2].innerText;
    const bookName = bookCard.children[0].innerText;
    const authorName = bookCard.children[1].innerText;
  
    const message = `The name of the book is ${bookName}  . It is written ${authorName} .  ${bookDescription}`;
  
    console.log(bookDescription);
    let synth = speechSynthesis;
    synth.cancel();
  
    setTimeout(() => {
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = "pt-BR";
      synth.speak(speech);
    }, 1000);
  }
  
  function search(e) {
    e.preventDefault();
    const search = document.getElementById("input").value;
    if (search.trim() === "") return;
    document.activeElement.blur(); // this removes focus on the input bar after search
  
    console.log("Working");
    $.ajax({
      url: `https://www.googleapis.com/books/v1/volumes?q="${search}"&maxResults=20`,
      dataType: "json",
      beforeSend: function () {
        $(".whirly-loader").show();
      },
      complete: function () {
        $(".whirly-loader").hide();
      },
  
      success: function (res) {
        const resultsContainer = document.getElementById("results");
        while (resultsContainer.firstChild) {
          resultsContainer.removeChild(resultsContainer.firstChild);
        }
  
        let bookNotFound = res.totalItems === 0;
  
        if (bookNotFound) {
          let notfound = document.createElement("DIV");
          notfound.innerHTML = `
          <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center text-center text-sm-left error-page">
              <img src="./img/file-not-found.gif" alt="404 error" width="100" height="100" class="m-2">
              <div>
                <p class="fs-3"> <span class="text-danger">Opps!</span> Book not found.</p>
                <p class="lead">The book you’re looking for doesn’t exist.</p>
              </div>
          </div>
          `;
  
          document.getElementById("results").appendChild(notfound);
        } else {
          for (let i = 0; i < res.items.length; i++) {
            // DIV
            const bookCard = document.createElement("div");
  
            // Imagem
            if (res.items[i].volumeInfo.imageLinks) {
              var bookImageContainer = document.createElement("div");
              bookImageContainer.classList.add("col-md-2", "offset-md-2");
  
              const bookImage = document.createElement("img");
              bookImage.src = res.items[i].volumeInfo.imageLinks.smallThumbnail;
              bookImage.classList.add("w-100");
  
              bookImageContainer.appendChild(bookImage);
            }
  
            // Titulo
            const bookInfo = document.createElement("div");
            bookInfo.classList.add("col-md-8");
            const bookTitle = document.createElement("h1");
            bookTitle.textContent = res.items[i].volumeInfo.title;
  
            //Autor
            if (res.items[i].volumeInfo.authors) {
              var bookAuthor = document.createElement("h6");
              bookAuthor.textContent = `by ${
                res.items[i].volumeInfo.authors[0]
                  ? res.items[i].volumeInfo.authors[0]
                  : "Sem titulo"
              }`;
            }
  
            // Descrição
            const bookDescription = document.createElement("p");
            bookDescription.classList.add("description");
            const desc = res.items[i].volumeInfo.description
              ? res.items[i].volumeInfo.description
              : "No description";
  
            const shortPar = document.createElement("span");
            shortPar.classList.add("short-description");
            const shortDesc = document.createTextNode(desc.substring(0, 100));
            shortPar.appendChild(shortDesc);
  
            const remainingPar = document.createElement("span");
            remainingPar.classList.add("remaining-description");
            const remainingDesc = document.createTextNode(desc.substring(100));
            remainingPar.appendChild(remainingDesc);
  
            const readMoreBtn = document.createElement("span");
            readMoreBtn.classList.add("read-more-btn");
            const readMoreBtnText = document.createTextNode(" ...Ver mais");
            readMoreBtn.appendChild(readMoreBtnText);
            readMoreBtn.addEventListener("click", (e) => {
              const remainingDescription = e.target.parentNode.querySelector(
                ".remaining-description"
              );
              remainingDescription.classList.toggle(
                "remaining-description--show"
              );
  
              e.target.textContent = e.target.textContent.includes(
                " ...Ver mais"
              )
                ? " ...Ver menos"
                : " ...Ver mais";
            });
  
            bookDescription.appendChild(shortPar);
            bookDescription.appendChild(remainingPar);
            if (desc !== "No description") {
              bookDescription.appendChild(readMoreBtn);
            }
  
            // Botoes
            const addToLidos = document.createElement("button"); //add a lidos
            addToLidos.classList.add("add-to-shelf-btn", "btn", "btn-outline-primary");
            addToLidos.textContent = "Add a lidos";
            addToLidos.addEventListener("click", (e) => {
              adicionarNaEstante1(res.items[i].volumeInfo);
            });
          
            const addToLendo = document.createElement("button"); //add a lendo
            addToLendo.classList.add("add-to-shelf-btn", "btn", "btn-outline-primary");
            addToLendo.textContent = "Add a lendo";
            addToLendo.addEventListener("click", (e) => {
              adicionarNaEstante2(res.items[i].volumeInfo);
            });
          
            const addToQrLer = document.createElement("button"); //add a quero ler
            addToQrLer.classList.add("add-to-shelf-btn", "btn", "btn-outline-primary");
            addToQrLer.textContent = "Add a quero ler ";
            addToQrLer.addEventListener("click", (e) => {
              adicionarNaEstante3(res.items[i].volumeInfo);
            });
  
            const bookPreviewLink = document.createElement("a");
            // bookPreviewLink.innerHTML = "LER";
            // bookPreviewLink.href = res.items[i].volumeInfo.previewLink;
            // bookPreviewLink.target = "blank";
  
            const speechButton = document.createElement("button");
            // speechButton.classList.add("listen", "btn", "btn-outline-secondary");
            // speechButton.textContent = "LISTEN";
  
            //bookPreviewLink.classList.add("btn", "btn-outline-secondary");
            bookCard.classList.add("result", "row");
            bookCard.setAttribute("data-aos", "fade-up");
  
            bookInfo.append(
              bookTitle,
              bookAuthor,
              bookDescription,
              // bookPreviewLink,
              // speechButton,
              addToLidos,
              addToLendo,
              addToQrLer
            );
  
            bookCard.append(bookInfo, bookImageContainer);
            document.getElementById("results").appendChild(bookCard);
            document.getElementById("results").scrollIntoView();
          }
        }
      },
      maxResults: 30,
      type: "GET",
    });
  }
  
  document.querySelector(".search-form").addEventListener("submit", search);
  
  const scroll = document.getElementById("return-to-top");
  window.onscroll = () => scrollFunction();
  function scrollFunction() {
    if (document.body.scrollTop || document.documentElement.scrollTop > 20) {
      scroll.classList.remove("special1");
    } else {
      scroll.classList.add("special1");
    }
  }
  
  //adiciona livro na estante 1 (lidos)
  function adicionarNaEstante1(livroInfo) {
    const estante = JSON.parse(localStorage.getItem('estante')) || []; // Obter a lista atual da estante do localStorage
  
    estante.push(livroInfo); // Adicionar o novo livro à estante
    localStorage.setItem('estante', JSON.stringify(estante));// Salvar a estante atualizada no localStorage
    if (redirecionar) { // Redirecionar para a página da estante
      window.location.href = 'lidos.html';
    } 
    
    adicionarNaEstante1(livroInfo, false);
  }
  
  //adiciona livro na estante 2 (lendo)
  function adicionarNaEstante2(livroInfo) {
    const estante2 = JSON.parse(localStorage.getItem('estante2')) || []; 
  
    estante2.push(livroInfo); 
    localStorage.setItem('estante2', JSON.stringify(estante2));
    if (redirecionar) { 
      window.location.href = 'lendo.html';
    } 
    
    adicionarNaEstante2(livroInfo, false);
  }
  
  //adiciona livro na estante 3 (quero ler)
  function adicionarNaEstante3(livroInfo) {
    const estante3 = JSON.parse(localStorage.getItem('estante3')) || []; 
  
    estante3.push(livroInfo);
    localStorage.setItem('estante3', JSON.stringify(estante3));
    if (redirecionar) { 
      window.location.href = 'ler.html';
    } 
    
    adicionarNaEstante3(livroInfo, false);
  }