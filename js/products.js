
async function renderCollectionsPage(page = 1) {
  const productsPerPage = 16;
  const mainContent = document.getElementById("main-content");
  const homeSiteContent = document.getElementById("main-site-content");

  if (!mainContent || !homeSiteContent) return;

  homeSiteContent.style.display = "none";
  mainContent.innerHTML = "Loading...";
  window.scrollTo(0, 0);

  try {
    const response = await fetch("http://localhost:5001/api/products");
    const result = await response.json();
    let products = Array.isArray(result) ? result : result.data;

    if (!products || products.length === 0) {
      mainContent.innerHTML = "No products found.";
      return;
    }

    const indexOfLastProduct = page * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(
      indexOfFirstProduct,
      indexOfLastProduct,
    );
    const totalPages = Math.ceil(products.length / productsPerPage);

    mainContent.innerHTML = `


            <div class="container">
            <h2 style="font-size: 48px; font-weight: 700; color: #111; margin-bottom: 20px; margin-top: 10px; text-align: center;">Our Collections</h2>
                        <div class="grid-container">
                    ${currentProducts.map((product) => productCard(product)).join("")}
                </div>

                <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin: 80px 0;">
                    <button onclick="renderCollectionsPage(${page - 1})" ${page === 1 ? "disabled" : ""} style="border: 1px solid #EEE; background: #fff; width: 40px; height: 40px; cursor: pointer; border-radius: 4px;"><i class="fa-solid fa-chevron-left"></i></button>
                    
                    ${Array.from({ length: totalPages }, (_, i) => i + 1)
                      .map(
                        (num) => `
                        <button onclick="renderCollectionsPage(${num})" style="border: 1px solid #EEE; background: ${page === num ? "#000" : "#fff"}; color: ${page === num ? "#fff" : "#000"}; width: 40px; height: 40px; cursor: pointer; border-radius: 4px; font-weight: 600;">${num}</button>
                    `,
                      )
                      .join("")}
                    
                    <button onclick="renderCollectionsPage(${page + 1})" ${page === totalPages ? "disabled" : ""} style="border: 1px solid #EEE; background: #fff; width: 40px; height: 40px; cursor: pointer; border-radius: 4px;"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
        `;
  } catch (error) {
    console.error("Error:", error);
    mainContent.innerHTML = "Failed to load products.";
  }
}
