let cart = [];
let modalQt = 1;
let modalKey = 0;

const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);

burgerJson.map((item, index) => {
    let burgerItem = qs(".models .burger-item").cloneNode(true);

    //Preencher as informações em burgerItem

    burgerItem.setAttribute("data-key", index);
    burgerItem.querySelector(".burger-item--img img").src = item.img;
    burgerItem.querySelector(".burger-item--price").innerHTML =
        `R$ ${item.price.toFixed(2)}`;
    burgerItem.querySelector(".burger-item--name").innerHTML = item.name;
    burgerItem.querySelector(".burger-item--desc").innerHTML = item.description;
    burgerItem.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        let key = e.target.closest(".burger-item").getAttribute("data-key");

        modalQt = 1;
        modalKey = key;

        qs(".burgerBig img").src = burgerJson[key].img;
        qs(".burgerInfo h1").innerHTML = burgerJson[key].name;
        qs(".burgerInfo--desc").innerHTML = burgerJson[key].description;
        qs(".burgerInfo--actualPrice").innerHTML = `R$ ${burgerJson[
            key
        ].price.toFixed(2)}`;

        qs(".burgerInfo--friesSize.selected").classList.remove("selected");
        qsa(".burgerInfo--friesSize").forEach((size, sizeIndex) => {
            if (sizeIndex === 0) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML =
                burgerJson[key].sizes[sizeIndex];
        });

        qs(".burgerInfo--qt").innerHTML = modalQt;

        qs(".burgerWindowArea").style.opacity = 0;
        qs(".burgerWindowArea").style.display = "flex";
        setTimeout(() => {
            qs(".burgerWindowArea").style.opacity = 1;
        }, 200);
    });

    // Adicionar na tela

    qs(".burger-area").append(burgerItem);
});

// Eventos do Modal

function closeModal() {
    qs(".burgerWindowArea").style.opacity = 0;

    setTimeout(() => {
        qs(".burgerWindowArea").style.display = "none";
    }, 500);
}

qsa(".burgerInfo--cancelButton, .burgerInfo--cancelMobileButton").forEach(
    (item) => {
        item.addEventListener("click", closeModal);
    },
);
qs(".burgerInfo--qtmenos").addEventListener("click", () => {
    if (modalQt > 1) {
        modalQt--;
        qs(".burgerInfo--qt").innerHTML = modalQt;
    }
});
qs(".burgerInfo--qtmais").addEventListener("click", () => {
    modalQt++;
    qs(".burgerInfo--qt").innerHTML = modalQt;
});
qsa(".burgerInfo--friesSize").forEach((size, sizeIndex) => {
    size.addEventListener("click", () => {
        qs(".burgerInfo--friesSize.selected").classList.remove("selected");
        size.classList.add("selected");
    });
});

// Carrinho

qs(".burgerInfo--addButton").addEventListener("click", () => {
    let size = parseInt(
        qs(".burgerInfo--friesSize.selected").getAttribute("data-key"),
    );

    let identifier = burgerJson[modalKey].id + "@" + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: burgerJson[modalKey].id,
            size,
            qt: modalQt,
        });
    }

    updateCart();
    closeModal();
});

qs(".menu-openner").addEventListener("click", () => {
    if (cart.length > 0) {
        qs("aside").style.left = "0";
    }
});

qs(".menu-closer").addEventListener("click", () => {
    qs("aside").style.left = "100vw";
});

function updateCart() {
    qs(".menu-openner span").innerHTML = cart.length;

    if (cart.length > 0) {
        qs("aside").classList.add("show");
        qs(".cart").innerHTML = "";

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let burgerItem = burgerJson.find((item) => item.id == cart[i].id);
            subtotal += burgerItem.price * cart[i].qt;

            let cartItem = qs(".models .cart--item").cloneNode(true);

            let burgerSizeName;
            switch (cart[i].size) {
                case 0:
                    burgerSizeName = "";
                    break;
                case 1:
                    burgerSizeName = "(Batatinha P)";
                    break;
                case 2:
                    burgerSizeName = "(Batatinha M)";
                    break;
                case 3:
                    burgerSizeName = "(Batatinha G)";
                    break;
            }
            let burgerName = `${burgerItem.name} ${burgerSizeName}`;

            cartItem.querySelector("img").src = burgerItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = burgerName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

            cartItem
                .querySelector(".cart--item-qtmenos")
                .addEventListener("click", () => {
                    if (cart[i].qt > 1) {
                        cart[i].qt--;
                    } else {
                        cart.splice(i, 1);
                    }
                    updateCart();
                });

            cartItem
                .querySelector(".cart--item-qtmais")
                .addEventListener("click", () => {
                    cart[i].qt++;
                    updateCart();
                });

            qs(".cart").append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        qs("aside").classList.remove("show");
        qs("aside").style.left = "100vw";
    }
}
