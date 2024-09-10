let menu = document.querySelector('#menu')
let modal = document.querySelector('#cart-modal')
let cartBtn = document.querySelector('#cart-btn')
let cartItensContainer = document.querySelector('#cart-items')
let cartTotal = document.querySelector('#cart-total')
let checkoutBtn = document.querySelector('#checkout-btn')
let closeModalBtn = document.querySelector('#close-modal-btn')
let cartCount = document.querySelector('#cart-count')
let eddress = document.querySelector('#eddress')
let addressWarn = document.querySelector('#address-warn')

let cart = []

//abrir o modal do carrinho
cartBtn.addEventListener('click', () =>{
    modal.style.display = 'flex'
    updateCartModal()
})
//Fechar o modal do carrinho clicando na div 
modal.addEventListener('click', (e)=>{
    if(e.target == modal){
     modal.style.display = 'none' 
    }
})
//Fechar o modal do carrinho clicando no fechar
closeModalBtn.addEventListener('click',(e)=>{
    
    modal.style.display = 'none'
})

menu.addEventListener('click', (e)=>{
    parentButton = e.target.closest('.add-to-cart--btn')
    if(parentButton){
        let name = parentButton.getAttribute('data-name')
        let price = Number(parentButton.getAttribute('data-price'))
        
       //Adicionar no carrinho
        adicionaCarrinho(name, price)

    }
})

function adicionaCarrinho(name, price){

    let hasItem = cart.find(item => item.name === name)
    if(hasItem){
        hasItem.quantidade += 1
      
    }else{

        cart.push({
            name,
            price,
            quantidade: 1
        })
    }
    updateCartModal()
}

function updateCartModal(){
    cartItensContainer.innerHTML = ''
    let total = 0
    
    cart.forEach( item => {
        const div = document.createElement('div')
        div.classList.add('flex','justify-between', 'mb-4', 'flex-col')
        
        
        div.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantidade}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
            </div>
        
            <div>
                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
        `
        total += item.price * item.quantidade
        cartItensContainer.appendChild(div)
        
        
    })

    cartTotal.textContent = `R$ ${total.toFixed(2)}`
    cartCount.innerHTML = cart.length
}


//remover item do carrinho

    cartItensContainer.addEventListener('click', function(e){
        if(e.target.classList.contains('remove-btn')){
            let name = e.target.getAttribute('data-name')
            removeItemCart(name)
        }
    })

    function removeItemCart(name){
        let index = cart.findIndex(item => item.name === name)
        
        if(index !== -1){
            const item = cart[index]
            
            if(item.quantidade > 1){
                item.quantidade -=1
                updateCartModal()
                return;
                
            }else{
                cart.splice(index, 1)
                updateCartModal()
            }
            
        }
        
    } 


    eddress.addEventListener('input', (e)=>{
        let inputValue = e.target.value

        if(inputValue !== ""){
            eddress.classList.remove('border-red-500') 
            addressWarn.classList.add('hidden') 
        
        }
    })

    checkoutBtn.addEventListener('click', ()=>{

        let isOpen = horaAtual()
        if(!isOpen){
           Toastify({
            text: "Ops, O restaurante está fechado! ",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "linear-gradient(to right, #ff0301, #6a0000)",
            },
           }).showToast()
           return 
        }




        if(cart.length === 0) return
        if(eddress.value === ''){
         addressWarn.classList.remove('hidden') 
         eddress.classList.add('border-red-500')
         return 
        
        }

        //Finalizar Pedido

        let itemCart = cart.map((item)=>{
            return (`${item.name} Quantidade: ${item.quantidade} valor: ${item.quantidade} | `)
        }).join('')

        const message = encodeURIComponent(itemCart)
        const phone = '41998570121'
        window.open(`https://wa.me/${phone}?text=${message} Endereço: ${eddress.value}`, "_blank")

        cart = []
        updateCartModal()
    })

    function horaAtual (){
        let data = new Date()
        let hora = data.getHours()
        return hora >= 18 && hora < 22;
    }

    let spanItem = document.querySelector('#date-span')
        isOpen = horaAtual()

    if(isOpen){
        spanItem.classList.remove('bg-red-500')
        spanItem.classList.add('bg-green-600')
    }else{
        spanItem.classList.add('bg-red-500')
        spanItem.classList.remove('bg-green-600')
    }

