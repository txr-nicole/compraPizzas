let cart = [];
let modalQt = 1;
let modalKey = 0

const qSel = (el) => document.querySelector(el);
const qAll = (el) => document.querySelectorAll(el);


pizzaJson.map((pizza, index) => {
    let pizzaItem = qSel('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.innerHTML = `
    <a href="#">
        <div class="pizza-item--img"><img src="${pizza.img}" /></div>
        <div class="pizza-item--add">+</div>
    </a>
    <div class="pizza-item--price">R$ ${pizza.price.toFixed(2)}</div>
    <div class="pizza-item--name">${pizza.name}</div>
    <div class="pizza-item--desc">${pizza.description}</div>
    `;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1
        modalKey = key

        qSel('.pizzaBig img').src = pizzaJson[key].img
        qSel('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qSel('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qSel('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price.toFixed(2);
        qSel('.pizzaInfo--size.selected').classList.remove('selected')
        qAll('.pizzaInfo--size').forEach((size, index) => {
            if (index == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[index]
        });
        qSel('.pizzaInfo--qt').innerHTML = modalQt


        qSel('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            qSel('.pizzaWindowArea').style.opacity = 1;
        }, 200)
    })

    qSel('.pizza-area').append(pizzaItem)
})

function closeModal() {
    qSel('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qSel('.pizzaWindowArea').style.display = 'none';
    }, 500)
}
qAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item => {
    item.addEventListener('click', closeModal)
});
qSel('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--
        qSel('.pizzaInfo--qt').innerHTML = modalQt
    } else {
        closeModal()
    }
})
qSel('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++
    qSel('.pizzaInfo--qt').innerHTML = modalQt
})
qAll('.pizzaInfo--size').forEach((size, index) => {
    size.addEventListener('click', (e) => {
        qSel('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
});
qSel('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(qSel(".pizzaInfo--size.selected").getAttribute('data-key'));
    let identifier = `${pizzaJson[modalKey].id}@${size}`;

    let key = parseInt(cart.findIndex((item) => item.identifier == identifier));
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart()
    closeModal();
});

qSel('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        qSel('aside').style.left = 0
    }
})
qSel('.menu-closer').addEventListener('click', () => {
    qSel('aside').style.left = '100vw'
})

function updateCart() {
    qSel('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        let subtotal = 0;
        let total = 0;
        let discount = 0;

        qSel('aside').classList.add('show');
        qSel('.cart').innerHTML = ''
        cart.map((_pizza, i) => {
            let pizzaItem = pizzaJson.find(pizza => pizza.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = qSel(".models .cart--item").cloneNode(true);
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name}(${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-name').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })


            qSel('.cart').append(cartItem);
        })
        discount = subtotal * 0.1;
        total = subtotal - discount;
        qSel('.subtotal span:last-child').innerHTML = `R$${subtotal.toFixed(2)}`;
        qSel('.desconto span:last-child').innerHTML = `R$${discount.toFixed(2)}`;
        qSel('.total span:last-child').innerHTML = `R$${total.toFixed(2)}`;
    } else {
        qSel('aside').classList.remove('show')
        qSel('aside').style.left = '100vw'
    }
}