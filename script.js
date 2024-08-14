const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addresInput = document.getElementById('address')
const addresWarn = document.getElementById('address-warn')


let cart = []


// FUNÇÃO PARA ABRIR MODAL AO CLICAR NO BOTÃO DE VER CARRINHO
cartBtn.addEventListener('click', function(){
    updateCartModal();
    cartModal.style.display = 'flex'
})


// FUNÇÃO PARA FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener('click', function(event){
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})


// FUNÇÃO PARA FECHAR MODAL QUANDO CLICAR NO closeModalBtn
closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = 'none'
})


menu.addEventListener('click', function(event){
    let parentButton = event.target.closest('.add-to-cart-btn');

    if(parentButton){
        // PEGAR NOME E PREÇO DO PRODUTO
        const name = parentButton.getAttribute('date-name')
        const price = parseFloat(parentButton.getAttribute('date-price'))

        // console.log(name)
        // console.log(price)

        // ADICIONAR NO CARRINHO
        addToCart(name,price)
    }
})


//FUNÇÃO PARA ADICIONAR ITEM NO CARRINHO
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // SE O ITEM JÁ EXISTE NO CARRINHO SOMA MAIS À QUANTIDADE
        existingItem.quantity += 1
    }else{
        // ADICIONANDO ITEM NOVO
        cart.push({
            name,
            price,
            quantity:1,
        })
    }

    // ATUALIZANDO VISUALMENTE O CARRINHO
    updateCartModal()
}


//FUNÇÃO PARA ATUALIZAR O CARRINHO VISUAMENTE
function updateCartModal(){
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');

        // INSERINDO OS ITENS DO CART NO MODAL
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between mb-6"> 
                <div> 
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium">R$ ${item.price.toFixed(2)}</p>

                </div>

                <button 
                    class="bg-red-500 text-white font-bold px-2 py-1 rounded text-sm remove-btn"

                    date-name = "${item.name}"
                >
                        Remover
                </button>
            </div>
        `

        total += item.price *item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })


    //ATUALIZANDO O TOTAL DO PEDIDO, JÁ CONVERTENDO O VALOR PARA MOEDA BRL
    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // ATUALIZANDO A QUANTIDADE DE PRODUTOS NO FOOTER
    cartCounter.innerHTML = cart.length;
}


// FUNÇÃO PARA REMOVER PRODUTO
cartItemsContainer.addEventListener('click', function(event){
    if(event.target.classList.contains('remove-btn')){
        const name = event.target.getAttribute('date-name')

        console.log(name);
        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]

        //DIMUNUINDO O NUMERO DE QUANTIDADE SE A MESMA FOR MAIOR QUE 1
        if(item.quantity >1){
            item.quantity -= 1
            updateCartModal();
            return
        }

        // REMOVENDO O ITEM DO CART QUE TEM SOMENTE UMA QUANTIDADE
        cart.splice(index, 1);
        updateCartModal()
    }

}


addresInput.addEventListener('input', function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addresWarn.classList.add('hidden')
    }

})


// FUNÇÃO FINALIZAR PEDIDO
checkoutBtn.addEventListener('click', function(){
    const isOpen = checkHour();
    if(!isOpen){
        
        Toastify({
            text: "OPSSS!! O RESTAURANTE ESTÁ FECHADO NO MOMENTO",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addresInput.value === ""){
        addresWarn.classList.remove('hidden')
        return;
    }

    // ENVIAR PEDIDO PARA O API DO WHATSAPP WEB
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: ${item.quantity} Preço: R$${item.price}`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = '393516787924'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addresInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})


// VERIFICAR A HORA E MANIPULAR O CARD HORARIO 
function checkHour(){
    const data = new Date();
    const hora = data.getHours();

    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span');
const isOpen = checkHour();

if(isOpen){
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
}else{
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-500');
}