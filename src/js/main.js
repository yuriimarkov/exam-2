const navBtn = document.querySelector('.nav-btn');
const header = document.querySelector('.header');

navBtn.addEventListener("click", () => {
  header.classList.toggle("active");
});


    const urlApi = 'https://makeup-api.herokuapp.com/api/v1/products.json?product_type=lipstick';
    const cardHolder = document.querySelector('.cards-holder')
    const cardHolderChosen = document.querySelector('.chosen')
    const selectCategory = document.querySelector('.category')
    const selectBrand = document.querySelector('.brand')
    const search = document.querySelector('.search');
    const pagination = document.querySelector('.pagination');

    let rows = 9;
    let currentPage = 0;
    fetch(urlApi)
        .then(data => data.json())
        .then(data => {
            console.log(data)
            showSortElement(data)
            displayPagination(data);
        })
        .catch((err) => console.log("Error:", err));

        let favoriteItems = [];




    function showSortElement (data) {
        cardHolder.innerHTML = '';
        cardHolderChosen.innerHTML= '';
        selectCategory.value = 'all';
        selectCategory.innerHTML = '<option value="all">all</option>';
        selectBrand.value = 'all';
        selectBrand.innerHTML = '<option value="all">all</option>';
        const start = rows * currentPage;
        const end = start + rows;
        let prodDataSliced = data.slice(start,end);
        let prodData = data;
        let selectedCharByCategory = [];  
        let selectedCharByBrand = []; 
        let randomItems = [];
        prodDataSliced.forEach((item) => {
            let newItem = createItem(item);
            cardHolder.append(newItem);
        })
        prodData.forEach(element => {
          selectedCharByCategory.push(element.category);
          selectedCharByBrand.push(element.brand)
        });

        for (let i =0 ; i < 3; i++) {
            let index = Math.floor(Math.random() * prodData.length);
            randomItems.push(prodData[index]);
            prodData.splice(index, 1);
        }

       randomItems.forEach(item => {
        let newItem = createItem(item);
        cardHolderChosen.append(newItem)
       })
        
        
        function searchInput(word, data) {
            return prodData.filter(s => {
                const regex = new RegExp(word,'gi');
                return s.name.match(regex);
            })
        }

        function  displaySearch () {
            cardHolder.innerHTML = '';
            if (this.value === '') {prodDataSliced.forEach((item) => {
                let newItem = createItem(item);
                cardHolder.append(newItem);
            })}
            else {
                const options = searchInput(this.value, prodData);
                options.forEach(item => {
                let card = createItem(item)
                cardHolder.append(card);
            })
            }
        }

        let selectItemByBrand = Array.from(new Set(selectedCharByBrand));
        selectItemByBrand.forEach(item => {
            let option = document.createElement('option');
            option.setAttribute('value', item);
            option.innerText = item;
            selectBrand.append(option)
        })

        function sortByBrand() {
          cardHolder.innerHTML = "";
            if (selectBrand.value !== 'all') {
                cardHolder.innerHTML = '';
                let prodArr = prodData.filter(e => e.brand === selectBrand.value);
                prodArr.forEach(item => {
                    let prod = createItem(item)
                    cardHolder.append(prod);
                })
            } else {
                prodDataSliced.forEach((item) => {
                    let newItem = createItem(item);
                    cardHolder.append(newItem);
                })
            }
        }

        let selectItemByCategory = Array.from(new Set(selectedCharByCategory));
        selectItemByCategory.forEach(item => {
            if (item !== null) {
                let option = document.createElement('option');
            option.setAttribute('value', item);
            option.innerText = item;
            selectCategory.append(option)
            }
        })
        
        function sortByCategory () {
            cardHolder.innerHTML = '';
            if (selectCategory.value !== 'all') {
                cardHolder.innerHTML = '';
                let prodArr = prodData.filter(e => e.category === selectCategory.value);
                prodArr.forEach(item => {
                    let prod = createItem(item)
                    cardHolder.append(prod);
                })
            } else {
                prodDataSliced.forEach((item) => {
                    let newItem = createItem(item);
                    cardHolder.append(newItem);
                })
            }
        }
        search.addEventListener('keyup',displaySearch);
        selectBrand.addEventListener('change', sortByBrand);
        selectCategory.addEventListener('change', sortByCategory)     
    }

    
    
    function createItem(element) {
            const cardItem = document.createElement("div");
            cardItem.classList.add('card-item'); 
            const imgHolder = document.createElement('div')
            imgHolder.classList.add('img-holder');
            const img = document.createElement('img');
            img.src = element.api_featured_image;
            const content = document.createElement('div')
            content.classList.add('content')
            const cardName = document.createElement('span')
            cardName.classList.add('card-name');
            cardName.innerHTML = `${element.brand} ${element.name}`;
            const price = document.createElement('strong')
            price.classList.add('card-price');
            price.innerHTML = `${Math.floor(element.price)} $`;
            const btnHolder = document.createElement('div')
            btnHolder.classList.add('btn-holder');
            const addBtn = document.createElement('button')
            addBtn.setAttribute('class','btn add-item');
            addBtn.innerText = 'Add bag '
            const favoriteBtn = document.createElement('button')
            favoriteBtn.setAttribute('class','btn favorite-btn icon-heart');
            imgHolder.append(img);
            content.append(cardName,price)
            btnHolder.append(addBtn,favoriteBtn)
            cardItem.append(imgHolder,content,btnHolder);

            favoriteBtn.addEventListener("click", () => {
                cardItem.classList.toggle("favorite");
                let checkItem = favoriteItems.indexOf(element);
                  if(~checkItem) {
                    favoriteItems.splice(checkItem,1);
                  } else {
                    favoriteItems.push(element)
                  }
              });

              
            return cardItem;
       }
       function displayPagination(data) {
        pagination.innerHTML = '';
        const pageCount = Math.ceil(data.length / rows - 1);
        console.log(pageCount)
        let ul = document.createElement('ul');
        ul.classList.add('pagination__list');
        pagination.append(ul);
        for(let i = 1; i < pageCount; i++) {
            const li = document.createElement('li');
            li.classList.add('pagination__item');
            li.value = i;
            li.innerHTML = `${i}`;
            ul.append(li);
            li.addEventListener('click', e => {
                let el = document.querySelectorAll('.pagination__item')
                el.forEach(e => {
                    e.classList.remove('active');
                })
                li.classList.add('active');
                currentPage = e.target.value - 1;
             showSortElement(data)
            })
            document.querySelectorAll('.pagination__item')[0].classList.add('active');
        }
    };

    function createItemWindow (element) {
        const cardItem = document.createElement("div");
        cardItem.classList.add('card-item'); 
        const imgHolder = document.createElement('div')
        imgHolder.classList.add('img-holder');
        const img = document.createElement('img');
        img.src = element.api_featured_image;
        const content = document.createElement('div')
        content.classList.add('content')
        const cardName = document.createElement('span')
        cardName.classList.add('card-name');
        cardName.innerHTML = `${element.brand} ${element.name}`;
        const price = document.createElement('strong')
        price.classList.add('card-price');
        price.innerHTML = `${Math.floor(element.price)} $`;

        imgHolder.append(img);
        content.append(cardName,price)
        cardItem.append(imgHolder,content);
        
        return cardItem;
    } 

    const favoriteModalContainer = document.querySelector('.favorite-modal')
    const favoriteModal = document.querySelector('.modal-content');
    const iconWindow = document.querySelector('.icon-heart');
    const closeBtn = document.querySelector('.close-btn');
    iconWindow.addEventListener('click', () => {
        showFavorite()
        favoriteModalContainer.style.display = "block";
    });
    function showFavorite() {
        favoriteModal.innerHTML = '';
        favoriteItems.forEach(e => {
            let newItem = createItemWindow(e)
            favoriteModal.append(newItem)
        })
    }

    closeBtn.onclick = () => {
        favoriteModalContainer.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == favoriteModalContainer) {
            favoriteModalContainer.style.display = "none";
        }
      }

