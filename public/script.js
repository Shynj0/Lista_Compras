const API_URL = "http://localhost:3000/compras";

function formatarMoeda(valor) {
    const numero = parseFloat(valor);
    if (isNaN(numero)) return "R$ 0,00";
    return `R$ ${numero.toFixed(2).replace(".", ",")}`;
}

document.addEventListener("DOMContentLoaded", carregarProdutos);

const form = document.getElementById("produto-form");
form.addEventListener("submit", salvarProdutos);

const table = document.querySelector("table");
const totalGeralElement = document.createElement("tr");
totalGeralElement.innerHTML = `
    <td colspan="3" class="total-geral-label">Total Geral:</td>
    <td id="total-geral" class="total-geral-value">R$ 0,00</td>
    <td></td>
`;
table.appendChild(totalGeralElement);

async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Falha ao carregar os produtos.");
        
        const produtos = await resposta.json();
        const lista = document.getElementById("produtos-lista");
        lista.innerHTML = "";
        
        produtos.forEach((produto) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${produto.nome}</td>
                <td>${formatarMoeda(produto.preco)}</td>
                <td>${produto.quantidade}</td>
                <td>${formatarMoeda(produto.preco * produto.quantidade)}</td>
                <td>
                    <button class="editar" onclick="editarProduto('${produto._id}', '${produto.nome}', '${produto.preco}', '${produto.quantidade}')">Editar</button>
                    <button class="excluir" onclick="excluirProduto('${produto._id}')">Excluir</button>
                </td>
            `;
            lista.appendChild(tr);
        });

        calcularTotalGeral();
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

async function salvarProdutos(e) {
    e.preventDefault();
    
    const id = document.getElementById("cliente-id").value;
    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;
    
    const produto = { nome, preco, quantidade };
    
    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto),
        });
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto),
        });
    }
    
    form.reset();
    document.getElementById("cliente-id").value = "";
    carregarProdutos();
}

function editarProduto(id, nome, preco, quantidade) {
    document.getElementById("cliente-id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("preco").value = preco;
    document.getElementById("quantidade").value = quantidade;
}

async function excluirProduto(id) {
    if (confirm("Deseja realmente excluir este produto?")) {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!resposta.ok) throw new Error(`Erro ao excluir: ${resposta.statusText}`);
            carregarProdutos();
        } catch (error) {
            alert(`Erro ao excluir o produto: ${error.message}`);
            console.error(error);
        }
    }
}

function calcularTotalGeral() {
    const totais = document.querySelectorAll("#produtos-lista tr");
    let totalGeral = 0;
    
    totais.forEach(row => {
        const totalCell = row.querySelector("td:nth-child(4)"); 
        if (totalCell) {
            const valorTexto = totalCell.textContent.replace("R$", "").replace(",", ".").trim();
            totalGeral += parseFloat(valorTexto) || 0;
        }
    });
    
    document.getElementById("total-geral").textContent = formatarMoeda(totalGeral);
}
