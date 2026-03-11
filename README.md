# ListaMercadoNova

Site de lista de mercado em HTML/CSS/JS, pronto para publicar no GitHub Pages.

## Funcionalidades

- Tabela com colunas: **Nome do item, Quantidade, Categoria, Valor unitário, Valor total, Carrinho e Remover**.
- Cadastro de novos itens.
- Edição em linha de **quantidade, categoria e valor unitário** com recálculo automático.
- Ordenação por categoria nesta ordem: **Higiene, Mercearia, Congelados, Hortifruti, Outros**.
- Total geral atualizado automaticamente.
- Responsivo para web e mobile.
- Carregamento inicial via arquivo `data/lista-mercado.json`.
- Persistência local no navegador (`localStorage`).
- Exportação e importação de JSON para compartilhar/sincronizar os dados entre pessoas.

## Sobre salvar para “qualquer um” sem banco de dados

No GitHub Pages (site estático), o navegador **não pode gravar diretamente no repositório**. Por isso:

- O site lê o arquivo JSON inicial do projeto.
- Depois salva alterações no navegador local.
- Para compartilhar com outras pessoas, use **Exportar JSON** e elas podem usar **Importar JSON**.

Se quiser salvar globalmente para todos em tempo real, será necessário um backend/API.

## Publicar no GitHub Pages

1. Suba os arquivos para o repositório.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment**, selecione:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (ou branch desejada), pasta `/root`
4. A URL ficará no formato:
   - `https://SEU_USUARIO.github.io/ListaMercadoNova/`