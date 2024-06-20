import * as Challenge from '/codebuddy/js/models/challengeModel.js';


if (!localStorage.challengeContents) {

const challengeContents = [
    {
      question: "Qual é o operador de igualdade estrita em JavaScript?",
      answer: `===`,
      tip: "É igual de trás para a frente e de frente para trás",
    },
    {
      question: "Qual é o método usado para concatenar arrays em JavaScript?",
      answer: `concat()`,
      tip: "Começa com a letra 'c'",
    },
    {
      question: "Qual é o operador usado para exponenciação em Python?",
      answer: `**`,
      tip: "São dois caracteres especiais juntos",
    },
    {
      question:
        "Qual é o elemento HTML usado para criar uma lista não ordenada?",
      answer: `<ul>`,
      tip: "O elemento é representado por duas letras entre dois caracteres especiais",
    },
    {
      question: "Qual é o elemento HTML usado para criar um link?",
      answer: `<a>`,
      tip: "É representado pela primeira letra do alfabeto entre dois caracteres especiais'",
    },
    {
      question:
        "Como se aplica um estilo CSS a um elemento com o id definido como 'content",
      answer: "#content",
      tip: "Começa com um caracter especial e o nome do id",
    },
    {
      question:
        "Qual é o método usado para adicionar um elemento no final de um array em JavaScript?",
      answer: "push()",
      tip: "Começa com a letra 'p' seguido de parênteses",
    },
    {
      question: "Como se define um comentário de uma linha em Python?",
      answer: "#",
      tip: "Representado por um único caracter",
    },
    {
      question:
        "Qual é o seletor CSS usado para selecionar todos os elementos filhos de um elemento pai?",
      answer: ">",
      tip: "É um símbolo matemático que indica uma relação direta.",
    },
    {
      question:
        "Qual é a propriedade CSS usada para definir a altura de um elemento?",
      answer: "height",
      tip: "Uma palavra simples que descreve a dimensão vertical de um elemento.",
    },
    {
      question: "Como você converte um número para uma string em Python?",
      answer: "str()",
      tip: "Três letras que abreviam 'string' seguida de parênteses",
    },
    {
      question:
        "Qual é o método usado para remover o último elemento de um array em JavaScript?",
      answer: "pop()",
      tip: "Começa com a letra 'p'",
    },
    {
      question:
        "Qual é o operador usado para incrementar o valor de uma variável em JavaScript?",
      answer: "++",
      tip: "Dois símbolos iguais que indicam aumento",
    },
    {
      question: "Como se verifica o tipo de uma variável em Python?",
      answer: "type()",
      tip: "Função que retorna o tipo de dado de uma variável.",
    },
    {
      question:
        "Qual é a propriedade CSS usada para definir o espaçamento entre as linhas de texto?",
      answer: "line-height",
      tip: "Define a altura da linha de texto dentro de um elemento.",
    },
    {
      question: "Qual é a tag usada para inserir um quebra de linha em HTML?",
      answer: "<br>",
      tip: "É uma tag simples que não tem tag de fechamento.",
    },
    {
      question: "Como você define uma variável constante em JavaScript?",
      answer: "const",
      tip: "Uma palavra-chave que declara uma variável cujo valor não pode ser alterado depois de atribuído.",
    },
  ];
  challengeContents.forEach((chal) => {
    Challenge.createChallenge(chal.question, chal.answer, chal.tip);
  })
  
}
