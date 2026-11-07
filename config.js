/* ============================================================
   CONFIGURAÇÃO DA CAMPANHA — edite só este arquivo
   Datas e horários sempre no horário de Brasília (-03:00).
   ============================================================ */
window.CAMPANHA = {
  // Início do aulão (o 3º lote fecha neste horário)
  aula: "2026-11-24T20:00:00-03:00",

  lotes: [
    { nome: "1º lote", preco: "R$ 47", parcela: "ou 12x de R$ 4,90*", periodo: "até 14/11",
      fim: "2026-11-14T23:59:59-03:00",
      checkout: "https://checkout.expertemtributario.com.br/pay/imersao-bf26-1" },
    { nome: "2º lote", preco: "R$ 57", parcela: "ou 12x de R$ 5,94*", periodo: "de 15/11 a 20/11",
      inicio: "2026-11-15T00:00:00-03:00", fim: "2026-11-20T23:59:59-03:00",
      checkout: "https://checkout.expertemtributario.com.br/pay/imersao-bf26-2" },
    { nome: "3º lote (último)", preco: "R$ 67", parcela: "ou 12x de R$ 6,98*", periodo: "de 21/11 até a aula",
      inicio: "2026-11-21T00:00:00-03:00",
      checkout: "https://checkout.expertemtributario.com.br/pay/imersao-bf26-3" }
  ],

  // Página de obrigado
  grupoWhatsApp: "https://chat.whatsapp.com/IMv9fwQdv4S3i8KdnRZALf?s=sh&p=a&iam=2"
};
