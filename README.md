# ListaMercadoNova

Site de lista de mercado em HTML/CSS/JS, pronto para GitHub Pages.

## Funcionalidades

- Colunas: **Nome do item, Quantidade, Categoria, Valor unitário, Valor total, Carrinho e Remover**.
- Inclusão de novos itens.
- Edição em linha de **quantidade, categoria e valor unitário**, com recálculo automático.
- Ordenação por categoria: **Higiene, Mercearia, Congelados, Hortifruti, Outros**.
- Total geral dinâmico.
- Layout moderno e responsivo (web/mobile).
- Botão **Salvar lista-mercado.json** para baixar o arquivo atualizado com os itens atuais.

## Persistência sem banco de dados

- Carrega dados iniciais de `data/lista-mercado.json`.
- Salva alterações no `localStorage` do navegador para uso contínuo no mesmo dispositivo.
- Quando clicar em **Salvar lista-mercado.json**, o app gera e baixa um novo JSON para você substituir o arquivo `data/lista-mercado.json` no repositório.

## Publicar no GitHub Pages

1. Suba o projeto para o GitHub.
2. Acesse **Settings > Pages**.
3. Selecione:
   - **Source**: Deploy from a branch
   - **Branch**: `main` e pasta `/root`
4. URL esperada:
   - `https://augusto.buratto.github.io/ListaMercadoNova/`