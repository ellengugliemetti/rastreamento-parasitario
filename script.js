// Função para calcular a pontuação com base nas escolhas
document.getElementById("calculateButton").addEventListener("click", function () {
  let totalScore = 0;
  const respostas = []; // Lista para armazenar perguntas e respostas selecionadas

  // Seleciona todas as perguntas
  const perguntas = document.querySelectorAll(".question");

  perguntas.forEach((pergunta) => {
      const textoPergunta = pergunta.querySelector(".left").innerText; // Coleta o texto da pergunta
      const respostaSelecionada = pergunta.querySelector("input[type='radio']:checked"); // Resposta selecionada

      // Se houver uma resposta selecionada, adiciona à lista de respostas
      if (respostaSelecionada) {
          const valor = parseInt(respostaSelecionada.value, 10);
          respostas.push(`${textoPergunta}: ${respostaSelecionada.value}`); // Adiciona pergunta e resposta
          totalScore += valor; // Soma os valores
      } else {
          // Caso nenhuma resposta seja selecionada
          respostas.push(`${textoPergunta}: Não respondido`);
      }
  });

  // Exibe a pontuação total no div 'result'
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<h3>Sua pontuação final é: <span style="color: #234719;">${totalScore}</span></h3>`;

  // Determina a categoria com base na pontuação total
  const categoryResultDiv = document.getElementById("categoryResult");
  const categoryDescription = document.getElementById("categoryDescription");

  if (totalScore >= 0 && totalScore <= 46) {
      categoryResultDiv.className = "category-result green";
      categoryDescription.textContent = "Verde (0-46): Parasitas não são uma preocupação imediata.";
  } else if (totalScore >= 47 && totalScore <= 96) {
      categoryResultDiv.className = "category-result yellow";
      categoryDescription.textContent = "Amarela (47-96): Priorizar o tratamento dos parasitas.";
  } else if (totalScore >= 97) {
      categoryResultDiv.className = "category-result red";
      categoryDescription.textContent = "Vermelha (97-242): Parasitas são uma causa raiz significativa e devem ser tratados de forma intensiva.";
  }

  // Exibe a descrição da categoria
  categoryResultDiv.innerHTML = categoryDescription.textContent;

  // Habilita o botão de envio
  document.getElementById("sendButton").disabled = false;
});

// Função para enviar o resultado via EmailJS
document.getElementById("sendButton").addEventListener("click", function () {
  const respostas = []; // Lista para perguntas e respostas selecionadas
  const perguntas = document.querySelectorAll(".question");

  perguntas.forEach((pergunta) => {
      const textoPergunta = pergunta.querySelector(".left").innerText;
      const respostaSelecionada = pergunta.querySelector("input[type='radio']:checked");

      if (respostaSelecionada) {
          respostas.push(`${textoPergunta}: ${respostaSelecionada.value}`); // Adiciona pergunta e resposta
      } else {
          respostas.push(`${textoPergunta}: Não respondido`); // Caso não tenha resposta
      }
  });

  // Soma total e categoria
  const somaTotal = respostas.reduce((acc, curr) => {
      const match = curr.match(/\d+$/);
      return acc + (match ? parseInt(match[0], 10) : 0); // Soma os valores das respostas
  }, 0);

  let categoria = "";
  if (somaTotal >= 0 && somaTotal <= 46) {
      categoria = "Verde (0-46): Parasitas não são uma preocupação imediata.";
  } else if (somaTotal >= 47 && somaTotal <= 96) {
      categoria = "Amarela (47-96): Priorizar o tratamento dos parasitas.";
  } else if (somaTotal >= 97) {
      categoria = "Vermelha (97-242): Parasitas são uma causa raiz significativa e devem ser tratados de forma intensiva.";
  }

  // Informações do formulário (paciente, idade, etc.)
  const form = document.getElementById("parasiteForm");
  const paciente = form.querySelector('input[name="paciente"]').value || "N/A";
  const idade = form.querySelector('input[name="idade"]').value || "N/A";
  const peso = form.querySelector('input[name="peso"]').value || "N/A";
  const altura = form.querySelector('input[name="altura"]').value || "N/A";

  // Formata as informações para o e-mail, em um formato de lista simples
  let message = `Estética e Saúde Integrativa - Avaliação de Parasitas\n\n`;
  message += `Detalhes dos Sintomas Selecionados\n\n`;

  // Informações básicas
  //message += `Informações Básicas:\n`;
  //message += `Paciente: ${paciente}\n`;
  //message += `Idade: ${idade}\n`;
  //message += `Peso: ${peso} kg\n`;
  //message += `Altura: ${altura} cm\n\n`;

  // Questões adicionais (respostas das perguntas)
  message += `Questões Adicionais:\n`;
  message += respostas.join("\n"); // Adiciona todas as respostas separadas por nova linha
 

  // Envia os dados formatados para o EmailJS
  emailjs.init("g8sWY7mPSsR0riu6m"); // Substitua pelo seu User ID do EmailJS
  emailjs.send("service_pgi21eb", "template_9ky2jij", {
      to_name: "Ellen", // Destinatário fictício, substitua conforme necessário
      from_name: "Sistema de Avaliação de Parasitas",
      paciente: paciente,
      idade: idade,
      peso: peso,
      altura: altura,
      respostas: message, // Mensagem formatada em lista simples
      soma_total: somaTotal,
      categoria: categoria,
  })
  .then(() => {
      alert("Resultado enviado com sucesso!");
  })
  .catch((error) => {
      alert("Erro ao enviar resultado. Verifique sua configuração do EmailJS.");
      console.error(error);
  });
});
