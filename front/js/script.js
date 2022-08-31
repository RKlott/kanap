const api_url = "http://localhost:3000/api/products";

async function apiGetter() {
    return ((await fetch(api_url)).json());
}

async function productsDisplay() {
    let getter = await apiGetter().then((response) => {
        const products = response;

        for (let it in products) {

            //pointe, récupère et attribue un ID à un nouvel élément (canapé) sur le DOM
            let productIdentifier = document.createElement("a");
            document.querySelector(".items").appendChild(productIdentifier);
            productIdentifier.href = `product.html?id=${response[it]._id}`; //modif du lien pour qu'il inclus l'ID des produits

            //ajout d'un element article sur le DOM et liaison avec l'élément père
            let productItem = document.createElement("article");
            productIdentifier.appendChild(productItem);

            //ajout d'une image à l'article et définition du lien source de l'image et de son alt
            let productImg = document.createElement("img");
            productItem.appendChild(productImg);
            productImg.src = response[it].imageUrl;
            productImg.alt = response[it].altTxt;

            //ajout d'un titre à l'article et refactorisation du nom par défaut par celui du canapé cible dans l'API
            let productName = document.createElement("h3");
            productItem.appendChild(productName);
            productName.innerHTML = response[it].name;

            //ajout d'une description à l'article et refactorisation de la desc par défaut par celle du canapé cible dans l'API
            let productDesc = document.createElement("p");
            productItem.appendChild(productDesc);
            productDesc.innerHTML = response[it].description;

        }

        //catch des potentielles erreurs lors de l'exploitation de l'API
    }).catch((err) => {
        return err;
    })
}
//lancement de la fonction
productsDisplay();



