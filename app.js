const categoriasOrdem = ['Higiene', 'Mercearia', 'Congelados', 'Hortifruti'];
const categoriaFallback = 'Outros';
const categoriaSelect = document.getElementById('categoria');
const listaBody = document.getElementById('lista-body');
const totalGeral = document.getElementById('total-geral');
const form = document.getElementById('item-form');
const exportarBtn = document.getElementById('exportar');
const importarInput = document.getElementById('importar');

let itens = [];

function preencherCategorias() {
  [...categoriasOrdem, categoriaFallback].forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    categoriaSelect.appendChild(option);
  });
}

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ordenarItens(lista) {
  return [...lista].sort((a, b) => {
    const indexA = categoriasOrdem.indexOf(a.categoria);
    const indexB = categoriasOrdem.indexOf(b.categoria);
    const ordemA = indexA === -1 ? categoriasOrdem.length : indexA;
    const ordemB = indexB === -1 ? categoriasOrdem.length : indexB;
    if (ordemA !== ordemB) return ordemA - ordemB;
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
}

function salvarLocal() {
  localStorage.setItem('listaMercadoNova', JSON.stringify(itens));
}

function atualizarTotalGeral() {
  const total = itens.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0);
  totalGeral.textContent = formatarMoeda(total);
}

function atualizarItem(id, campo, valor) {
  itens = itens.map((item) => {
    if (item.id !== id) return item;
    return { ...item, [campo]: valor };
  });
  salvarLocal();
  renderizar();
}

function removerItem(id) {
  itens = itens.filter((item) => item.id !== id);
  salvarLocal();
  renderizar();
}

function criarInputNumero(item, campo, min, step) {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = min;
  input.step = step;
  input.value = item[campo];
  input.addEventListener('change', (e) => {
    const valor = Number(e.target.value);
    if (Number.isNaN(valor) || valor < Number(min)) {
      e.target.value = item[campo];
      return;
    }
    atualizarItem(item.id, campo, valor);
  });
  return input;
}

function criarSelectCategoria(item) {
  const select = document.createElement('select');
  [...categoriasOrdem, categoriaFallback].forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    if (item.categoria === categoria) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener('change', (e) => atualizarItem(item.id, 'categoria', e.target.value));
  return select;
}

function renderizar() {
  listaBody.innerHTML = '';
  const itensOrdenados = ordenarItens(itens);

  for (const item of itensOrdenados) {
    const tr = document.createElement('tr');

    const tdNome = document.createElement('td');
    tdNome.textContent = item.nome;

    const tdQuantidade = document.createElement('td');
    tdQuantidade.appendChild(criarInputNumero(item, 'quantidade', '0.01', '0.01'));

    const tdCategoria = document.createElement('td');
    tdCategoria.appendChild(criarSelectCategoria(item));

    const tdUnitario = document.createElement('td');
    tdUnitario.appendChild(criarInputNumero(item, 'valorUnitario', '0', '0.01'));

    const tdTotal = document.createElement('td');
    tdTotal.textContent = formatarMoeda(item.quantidade * item.valorUnitario);

    const tdCarrinho = document.createElement('td');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'checkbox';
    check.checked = item.noCarrinho;
    check.addEventListener('change', (e) => atualizarItem(item.id, 'noCarrinho', e.target.checked));
    tdCarrinho.appendChild(check);

    const tdRemover = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => removerItem(item.id));
    tdRemover.appendChild(removeBtn);

    tr.append(tdNome, tdQuantidade, tdCategoria, tdUnitario, tdTotal, tdCarrinho, tdRemover);
    listaBody.appendChild(tr);
  }

  atualizarTotalGeral();
}

function novoId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const quantidade = Number(document.getElementById('quantidade').value);
  const categoria = categoriaSelect.value;
  const valorUnitario = Number(document.getElementById('valor').value);

  if (!nome || quantidade <= 0 || valorUnitario < 0) return;

  itens.push({
    id: novoId(),
    nome,
    quantidade,
    categoria,
    valorUnitario,
    noCarrinho: false,
  });

  salvarLocal();
  form.reset();
  categoriaSelect.value = categoriasOrdem[0];
  renderizar();
});

exportarBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(itens, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lista-mercado.json';
  a.click();
  URL.revokeObjectURL(url);
});

importarInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const conteudo = await file.text();
    const listaImportada = JSON.parse(conteudo);
    if (!Array.isArray(listaImportada)) throw new Error('Formato inválido');

    itens = listaImportada.map((item) => ({
      id: item.id || novoId(),
      nome: String(item.nome || 'Item sem nome'),
      quantidade: Number(item.quantidade || 0),
      categoria: item.categoria || categoriaFallback,
      valorUnitario: Number(item.valorUnitario || 0),
      noCarrinho: Boolean(item.noCarrinho),
    }));

    salvarLocal();
    renderizar();
  } catch {
    alert('Não foi possível importar o arquivo JSON.');
  } finally {
    importarInput.value = '';
  }
});

async function carregarDadosIniciais() {
  preencherCategorias();
  categoriaSelect.value = categoriasOrdem[0];

  const local = localStorage.getItem('listaMercadoNova');
  if (local) {
    itens = JSON.parse(local);
    renderizar();
    return;
  }

  try {
    const resposta = await fetch('data/lista-mercado.json');
    if (!resposta.ok) throw new Error('Falha ao ler JSON inicial');
    itens = await resposta.json();
  } catch {
    itens = [];
  }

  salvarLocal();
  renderizar();
}

carregarDadosIniciais();
