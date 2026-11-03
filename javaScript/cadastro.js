import { supabase } from "./supabase.js";

const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
    cadastroForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("emailCadastro").value.trim();
        const senha = document.getElementById("senhaCadastro").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;
        const mensagem = document.getElementById("mensagemCadastro");
        const botao = cadastroForm.querySelector("button[type='submit']");

        // Validações
        if (!nome || !email || !senha || !confirmarSenha) {
            mensagem.textContent = "Preencha todos os campos.";
            return;
        }

        if (senha !== confirmarSenha) {
            mensagem.textContent = "As senhas não são iguais.";
            return;
        }

        // Evita cliques repetidos enquanto cadastra
        mensagem.textContent = "Cadastrando...";
        if (botao) botao.disabled = true;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: senha,
            options: {
                data: {
                    nome: nome
                }
            }
        });

        if (botao) botao.disabled = false;

        // Erros do Supabase, com mensagens amigáveis
        if (error) {
            if (error.message.includes("rate limit")) {
                mensagem.textContent = "Muitas tentativas de cadastro. Aguarde um pouco e tente novamente.";
            } else if (error.message.includes("you can only request this after")) {
                mensagem.textContent = "Aguarde alguns segundos antes de tentar novamente.";
            } else {
                mensagem.textContent = "Erro ao cadastrar: " + error.message;
            }
            return;
        }

        // E-mail já cadastrado: avisa e fica na página
        if (data.user?.identities?.length === 0) {
            mensagem.textContent = "Este e-mail já está cadastrado.";
            return;
        }

        // Cadastro novo: avisa e vai para o login
        mensagem.textContent = "Cadastro realizado! Confirme seu e-mail (se for pedido) e faça login. Redirecionando...";
        cadastroForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2500);
    });
}