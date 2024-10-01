
async function fetchSC(id) {
    fetch(`/api/productdata/${id}`)
    .then(response => response.json())
    .then(data => {
      const productContainer = document.getElementById('productList');
      productContainer.style.height ="auto"
      productContainer.innerHTML = '';
      data.forEach(element => {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women';

        productDiv.innerHTML = `
          <div class="block2">
            <div class="block2-pic hov-img0">
              <img src="/product/${element.mainImage}" alt="IMG-PRODUCT" />
              <a href="#" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">Quick View</a>
            </div>
            <div class="block2-txt flex-w flex-t p-t-14">
              <div class="block2-txt-child1 flex-col-l">
                <a href="/user/productDetail/${element._id}" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">${element.name}</a>
                <span class="text-black">₹ ${element.offerPrice}</span>
              </div>
              <div class="block2-txt-child2 flex-r p-t-3">
                 
              </div>
            </div>
          </div>
        `;

        productContainer.appendChild(productDiv);
      });
    })
    .catch(error => console.error('Error fetching data:', error));}
fetchSC(10)