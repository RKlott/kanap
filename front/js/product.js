let link = new URL(window.location.href).searchParams;
let productId = link.get("id");
let article;
const api_link = "http://localhost:3000/api/products/";

let images = document.getElementsByClassName("item__img");
let productTitle = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let quantity = document.getElementById("quantity");
let addToCartButton = document.getElementById("addToCart");

let allColors = document.getElementById("colors");

async function apiGetter() { //fonction servant à requêter l'API
    return ((await fetch(api_link + productId)).json()); //récupère les données de l'API et le formatte en JSON (format traitable)
}

async function productDisplay() {

    let getter = await apiGetter().then(async (result) => { //fonction de la récupération de la réponse de l'API
        article = await result; //récupération de la réponse de l'API

        if (article) { //si notre article existe
            showArticle(article); //nous montrer l'article avec ces informations, lancement de la fonction showArticle()
        }

    }).catch((error) => { //récupération des potentielles erreurs liés à la réception des requêtes de l'API
        return ("ERREUR : " + error);
    });
}

productDisplay(); //lancement de la fonction productDisplay()

function showArticle(article) { //fonction pour montrer l'article après récupérations de ses informations depuis l'API

    //ajout d'une image a notre article
    let productImg = document.createElement("img"); //création d'un élément "img" avec une variable-mère qui permettra de récupérer et de stocker dans d'autres variables les informations de l'article dans l'API
    images[0].appendChild(productImg); //ajout de la variable-mère à la liste des enfants du première élément ayant pour class "images"
    productImg.src = article.imageUrl; //modification de la variable(vide) "productImg.src" par l'image présente dans l'API
    productImg.alt = article.altTxt; //modification de la variable(vide) "productImg.alt" par l'alt de l'article présent dans l'API

    //ajout d'un nom a notre article
    productTitle.innerHTML = article.name; //modification de la variable(vide) "productTitle" par le nom de l'article présent dans l'API

    //ajout d'un prix a notre article
    productPrice.innerHTML = article.price; //modification de la variable(vide) "productPrice" par le prix de l'article présent dans l'API


    productDescription.innerHTML = article.description; //modification de la variable(vide) "productDescription" par la description de l'article présente dans l'API


    for (let colors of article.colors) { //pour les couleurs(variable vide, donc exploitable) définies dans les choix de couleurs de l'article :

        let productColors = document.createElement("option"); //création d'un élément "option" avec une variable-mère qui contiendra les couleurs de l'élément choisis
        allColors.appendChild(productColors); //ajout de la variable-mère à la liste des enfants de la variable "allColors"

        productColors.value = colors; //modification du contenu de la variable "productColors", ajout des couleurs listés dans l'API
        productColors.innerHTML = colors; //modification du DOM pour pouvoir afficher le choix de couleurs
    }
    addingToCart(article); //appel de la fonction pour ajouter un article au panier
}

//////////////////////////////////////////////////////////
//////////// Ajout de l'élément au panier ///////////////
////////////////////////////////////////////////////////
function addingToCart(article) { //fonction pour ajouter un article au panier
    addToCartButton.addEventListener('click', (e) => { //Evennement déclanché au clique sur le bouton "Ajouter au Panier"

        let quant = quantity.value; //copie du contenu de la variable "quantity" dans la variable "quant"
        let articleColor = allColors.value; //copie du contenu de la variable "allColors" dans la variable "articleColor"

        if (quant > 0 && quant <= 100 && quant != 0) {//si la quantité choisie est supérieure à 0, inférieure à 100 et inégale à 0 :
            if (!articleColor) { //si aucune couleur n'a été choisie :
                alert("Couleur non définie, veuillez saisir une valeur pour continuer.");
                return;
            }

            const productInfos = { //création d'un tableau comprenant des informations sur le produit qui nous seront utile plus des vérifications plus bas
                id: productId, //injection de l'ID de l'élément à la variable "id:"
                name: article.name, //injection du nom de l'élément à la variable "name:"
                color: articleColor, //injection des couleurs de l'élément à la variable "color:"
                quantity: Number(quant), //injection des quantités choisies à la variable "quantity:", le "Number();" est un constructeur convertissant un objet de tout type en nombre
            };

            let itemInLocalStorage = JSON.parse(localStorage.getItem("product")); //variable servant à récupérer l'élément "product" (qui est utilisé plus bas)
            //le déclarer ici sert à pouvoir vérifier plus bas s'il EXISTE dans le local storage, si non, nous lui ajoutons des informations, puis nous l'injectons au local storage

            let inCart = false; //boolean paramétré sur false, par défaut
            //il servira à savoir si l'article actuellement traité par l'utilisateur est présent ou non dans le panier

            const validationWindow = () => { //fonction servant à informer l'utilisateur de la réussite de l'opération, puis le redirige vers la page panier
                if (window.confirm("Vos articles ont été ajouté au panier ! Veuillez cliquer sur 'OK' pour poursuivre vers le panier.")) {//si l'utilisateur appuis sur OK (utilité de window.confirm):
                    document.location.href = (`./cart.html`); //on le redirige vers la page du panier (cart.html)
                }
            }

            const addToLocalStorage = () => { //fonction servant à ajouter un élément au local storage
                itemInLocalStorage.push(productInfos); //on injectes des informations (id, quantités, couleurs) à notre variable
                localStorage.setItem("product", JSON.stringify(itemInLocalStorage)); //on injecte notre variable dans un élément "product", qui sera ajouté au local storage
            }

            if (itemInLocalStorage) { //dans le cas où le panier n'est pas vide :
                itemInLocalStorage.forEach((selectedElement, key) => { //pour chaque élément présent dans le panier :
                    //on vérifie s'il est identique à l'article que nous traitons, donc nous vérifions si cet article est déjà dans le panier
                    if (selectedElement.id == productId && selectedElement.color == articleColor.value) { //Si nous trouvons un élément identique à notre article dans le panier :
                        itemInLocalStorage[key].quantity = parseInt(selectedElement.quantity) + parseInt(quant.value); //on mets à jour la quantité globale de l'article en additionnant ->
                        //les quantités déjà présente dans le panier avec les nouvelles
                        if (itemInLocalStorage[key].quantity <= 100) { //si la quantité d'article, après addition, est inférieure ou égale à 100 :
                            localStorage.setItem("product", JSON.stringify(itemInLocalStorage)); //on ajoute l'article au local storage
                            inCart = true; //boolean paramétré sur true pour ignorer le bloc d'instruction se déclanchant s'il est sur false
                            validationWindow(); //on ouvre la fenêtre de validation à l'utilisateur
                        } else { //si la valeur est supérieure à 100 :
                            itemInLocalStorage[key].quantity = 100; //on la définie sur 100
                            alert("Le nombre maximale d'articles étant de 100, votre nombre d'article à été modifié par cette valeur.");
                        }
                    }//si nous ne trouvons pas d'éléments indentique à notre article, le code continuera simplement vers le prochain bloc d'instructions
                });

                if (!inCart) { //si le produit n'est pas déjà présent dans le panier:
                    addToLocalStorage(); //on ajoute le produit au local storage
                    validationWindow(); //on ouvre la fenêtre de validation à l'utilisateur
                }

            } else { //Si le panier est totalement vide :
                itemInLocalStorage = []; //création d'un tableau vide
                addToLocalStorage(); //ajout des éléments au tableau et au local storage
                validationWindow(); //on ouvre la fenêtre de validation à l'utilisateur
            }


        }

        else { //si les quantités ne sont pas comprises entre 0 et 100 :
            alert("Nombre d'articles incorrect, veuillez saisir une valeur comprise entre 1 et 100.");
            return;
        }
    });
}


