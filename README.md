# 🎓 StudyFlow - Plataforma de Organização Acadêmica Inteligente

> **Estudo de Caso & Portfólio de Desenvolvedor Front-end / UI / UX**

![StudyFlow Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen)
![Acessibilidade](https://img.shields.io/badge/Acessibilidade-WCAG--AA-blue)
![Linguagem](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS--ES6-orange)

---

## 📌 1. Visão Geral do Produto
O **StudyFlow** é uma aplicação web (SPA) focada em estudantes do ensino superior e técnico que buscam centralizar e gerenciar sua rotina de estudos de maneira ágil, moderna e sem fricções. O produto permite o cadastro de matérias, gestão completa de tarefas e trabalhos acadêmicos com prioridades e datas de entrega, acompanhamento visual de progresso e anotações privativas protegidas por autenticação biométrica.

---

## 🎨 2. Decisões de UI/UX & Design System

### 🧠 Baixa Carga Cognitiva e Heurísticas de Nielsen Aplicadas
1. **Visibilidade do Status do Sistema (Heurística 1):** Indicadores visuais de status (badges de prioridade, barras de progresso dinâmicas e animações nos cards) mantêm o usuário sempre ciente do seu rendimento acadêmico.
2. **Correspondência entre o Sistema e o Mundo Real (Heurística 2):** Uso da metáfora de agenda de estudos, calendário visual do mês e cores institucionais associadas a disciplinas.
3. **Controle e Liberdade do Usuário (Heurística 3):** Possibilidade simples de cancelar edições, reverter status de tarefas concluídas e gerenciar dados livremente.
4. **Consistência e Padronização (Heurística 4):** Componentes visualmente padronizados utilizando a biblioteca de ícones *Lucide Icons* e palette de cores coesa com variáveis CSS.
5. **Prevenção de Erros (Heurística 5):** Validações em tempo real nos formulários, impedindo envios com campos em branco e avisos claros de confirmação antes de exclusões.

### 🎨 Paleta de Cores e Tipografia
* **Cor Primária:** Indigo (`#4f46e5`) - Foco, clareza e ambiente de aprendizado.
* **Estados:** Verde Success (`#10b981`), Âmbar Warning (`#f59e0b`), Vermelho Danger (`#ef4444`).
* **Tipografia:** Tipografia do sistema (*System Stack*) garantindo máxima velocidade de renderização e legibilidade nativa no Android e iOS.

---

## 🖐️ 3. Interações & Gestos Touch Avançados
* **Gestos em Dispositivos Móveis (Touch):**
  * **Swipe para a Direita (Deslizar):** Marca a tarefa instantaneamente como concluída/pendente.
  * **Swipe para a Esquerda (Deslizar):** Dispara a ação de exclusão rápida da tarefa.
* **Feedback Háptico:** Integração com a Web Vibration API (`navigator.vibrate`) proporcionando resposta física ao toque em ações de cadastro, conclusão e deleção de itens.
* **Onboarding no Primeiro Acesso:** Modal explicativo interativo que guia novos usuários nas principais funcionalidades antes de iniciarem.

---

## 🔒 4. Área Protegida com Biometria
* Integração simulada e adaptativa utilizando a **WebAuthn API** (ou fallback com PIN seguro) para permitir acesso à aba de notas confidenciais (ex: credenciais de sistemas acadêmicos, notas de provas e contatos de professores).

---

## ♿ 5. Acessibilidade (a11y)
* **Atributos WAI-ARIA:** Suporte estruturado com `role="dialog"`, `aria-modal`, `aria-label`, e `aria-valuenow`.
* **Navegação por Teclado:** *Skip Link* no topo da página para pular direto ao conteúdo principal, além de retenção correta de foco e atalhos via `<button>`.
* **Contraste e Responsividade de Fonte:** Elementos textuais atendem aos critérios de contraste **WCAG AA** e permitem expansão pelo navegador sem quebra de layout.

---

## 🛠️ 6. Tecnologias Utilizadas
* **HTML5:** Estruturação semântica e acessível.
* **CSS3:** Flexbox, CSS Grid, Custom Properties (Variáveis), Animações CSS.
* **JavaScript ES6+:** Manipulação de DOM, LocalStorage API, Vibration API, WebAuthn API.
* **Lucide Icons:** Biblioteca leve de ícones vetoriais.

---

## 🚀 7. Como Executar o Projeto
1. Clone este repositório ou baixe os arquivos fonte (`index.html`, `styles.css`, `app.js`).
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Firefox, Safari, Edge).
3. Não é necessária a instalação de dependências ou servidores Node.js.

---
*Projeto desenvolvido para portfólio de desenvolvimento Front-end e UI/UX.*
