let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

burgerJson.map((item, index) => {
    let burgerItem = c(".models .burger-item").cloneNode(true);

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

        c(".burgerBig img").src = burgerJson[key].img;
        c(".burgerInfo h1").innerHTML = burgerJson[key].name;
        c(".burgerInfo--desc").innerHTML = burgerJson[key].description;
        c(".burgerInfo--actualPrice").innerHTML = `R$ ${burgerJson[
            key
        ].price.toFixed(2)}`;

        c(".burgerInfo--friesSize.selected").classList.remove("selected");
        cs(".burgerInfo--friesSize").forEach((size, sizeIndex) => {
            if (sizeIndex === 0) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML =
                burgerJson[key].sizes[sizeIndex];
        });

        c(".burgerInfo--qt").innerHTML = modalQt;

        c(".burgerWindowArea").style.opacity = 0;
        c(".burgerWindowArea").style.display = "flex";
        setTimeout(() => {
            c(".burgerWindowArea").style.opacity = 1;
        }, 200);
    });

    // Adicionar na tela

    c(".burger-area").append(burgerItem);
});

// Eventos do Modal

function closeModal() {
    c(".burgerWindowArea").style.opacity = 0;

    setTimeout(() => {
        c(".burgerWindowArea").style.display = "none";
    }, 500);
}

cs(".burgerInfo--cancelButton, .burgerInfo--cancelMobileButton").forEach(
    (item) => {
        item.addEventListener("click", closeModal);
    },
);
c(".burgerInfo--qtmenos").addEventListener("click", () => {
    if (modalQt > 1) {
        modalQt--;
        c(".burgerInfo--qt").innerHTML = modalQt;
    }
});
c(".burgerInfo--qtmais").addEventListener("click", () => {
    modalQt++;
    c(".burgerInfo--qt").innerHTML = modalQt;
});
cs(".burgerInfo--friesSize").forEach((size, sizeIndex) => {
    size.addEventListener("click", () => {
        c(".burgerInfo--friesSize.selected").classList.remove("selected");
        size.classList.add("selected");
    });
});

// Carrinho

c(".burgerInfo--addButton").addEventListener("click", () => {
    let size = parseInt(
        c(".burgerInfo--friesSize.selected").getAttribute("data-key"),
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

c(".menu-openner").addEventListener("click", () => {
    if (cart.length > 0) {
        c("aside").style.left = "0";
    }
});

c(".menu-closer").addEventListener("click", () => {
    c("aside").style.left = "100vw";
});

function updateCart() {
    c(".menu-openner span").innerHTML = cart.length;

    if (cart.length > 0) {
        c("aside").classList.add("show");
        c(".cart").innerHTML = "";

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let burgerItem = burgerJson.find((item) => item.id == cart[i].id);
            subtotal += burgerItem.price * cart[i].qt;

            let cartItem = c(".models .cart--item").cloneNode(true);

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

            c(".cart").append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
        c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c("aside").classList.remove("show");
        c("aside").style.left = "100vw";
    }
}
