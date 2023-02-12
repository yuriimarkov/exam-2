const navBtn = document.querySelector('.nav-btn');
const header = document.querySelector('.header');

navBtn.addEventListener("click", () => {
  header.classList.toggle("active");
});

const upBtn = document.querySelector('.arrow');
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        upBtn.style.display = "block";
    } else {
        upBtn.style.display = "none";
    }
  }

  upBtn.addEventListener('click',() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  } )



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
    let bagItems = [];

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
            price.innerHTML = `${element.price} $`;
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

            addBtn.addEventListener("click", () => {
                cardItem.classList.toggle("bag");
                let checkItem = bagItems.indexOf(element);
                  if(~checkItem) {
                    bagItems.splice(checkItem,1);
                  } else {
                    bagItems.push(element)
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
             document.querySelector('.products').scrollIntoView({
                behavior: 'smooth'
           });
            })
            document.querySelectorAll('.pagination__item')[0].classList.add('active');
        }
    };

    function createFavoriteWindow (element) {
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
        price.innerHTML = `${element.price} $`;

        imgHolder.append(img);
        content.append(cardName,price)
        cardItem.append(imgHolder,content);
        
        return cardItem;
    } 
    function createBagWindow (element) {
        const bagItem = document.createElement("div");
        bagItem.classList.add('bag__card-item'); 
        const bagImgHolder = document.createElement('div')
        bagImgHolder.classList.add('bag__img-holder');
        const img = document.createElement('img');
        img.src = element.api_featured_image;
        const bagContent = document.createElement('div')
        bagContent.classList.add('bag__content')
        const bagCardName = document.createElement('span')
        bagCardName.classList.add('bag__card-name');
        bagCardName.innerHTML = `${element.brand} ${element.name}`;
        const bagPrice = document.createElement('strong')
        bagPrice.classList.add('bag__card-price');
        bagPrice.innerHTML = `${element.price} $`;


        bagImgHolder.append(img);
        bagContent.append(bagCardName,bagPrice)
        bagItem.append(bagImgHolder,bagContent);
        
        return bagItem;
    } 
    
    function createForm () {
        const formHolder = document.createElement('div');
        formHolder.classList.add('form__holder');
        const form = document.createElement('form');
        form.classList.add('form');
        const formTitle = document.createElement('h2');
        formTitle.classList.add('form__title');
        formTitle.innerHTML = 'Contact info';
        const inputName = document.createElement('input');
        inputName.classList.add('input__name');
        const inputPhone = document.createElement('input');
        inputPhone.classList.add('input__number');
        inputPhone.setAttribute('type','phone');
        const inputEmail = document.createElement('input');
        inputEmail.classList.add('input__email');
        inputPhone.setAttribute('type','email');

        const addBtn = document.createElement('button')
        addBtn.setAttribute('class','btn add-item');
        addBtn.innerText = 'Buy Now'

        form.append(formTitle,inputName,inputPhone,inputEmail,addBtn);
        formHolder.append(form)

        return formHolder
    }

    const modalContainer = document.querySelector('.modal')
    const modal = document.querySelector('.modal-content');
    const favoriteBtn = document.querySelector('.icon-heart');
    const bagBtn = document.querySelector('.icon-shopping-cart')
    const closeBtn = document.querySelector('.close-btn');
    favoriteBtn.addEventListener('click', () => {
        showFavorite()
        modalContainer.style.display = "block";
    });
    bagBtn.addEventListener('click', () => {
        modal.classList.add('bag')
        showBag()
        modalContainer.style.display = "block";
    });
    function showFavorite() {
        modal.innerHTML = '';
        if (!favoriteItems.length > 0) {
            modal.innerHTML = `<span class='alternative-text'>Упс, тут ще немає товарів :(</span>`
        } else {
            favoriteItems.forEach(e => {
                let newItem = createFavoriteWindow(e)
                modal.append(newItem)
            })
        }
    }

    function showBag() {
        modal.innerHTML = '';
        const bagCointainer = document.createElement('div')
        bagCointainer.classList.add('bag__cards-holder')
        const bagCardTitle = document.createElement('h2');
        bagCardTitle.classList.add('bag__card-title');
        bagCardTitle.innerHTML = 'Product Price';
        const priceAll = document.createElement('span')
        priceAll.classList.add('price-all')

        let result = 0;
        bagItems.forEach(e => {
            result += +e.price;
        })
        console.log(result);
        priceAll.innerHTML = `Amount all : ${result} $`;
        if (!bagItems.length > 0) {
            modal.innerHTML = `<span class='alternative-text'>Упс, тут ще немає товарів :(</span>`
        } else {
            modal.append(createForm())
            bagCointainer.append(bagCardTitle);
            bagItems.forEach(e => {
                let newItem = createBagWindow(e);
                bagCointainer.append(newItem);
                modal.append(bagCointainer)
            })
            bagCointainer.append(priceAll);
        }
    }

    closeBtn.onclick = () => {
        modalContainer.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modalContainer) {
            modalContainer.style.display = "none";
        }
      }