import { supabase } from "./supabase.js";

/* ==========================================================
   LOGIN
   ========================================================== */

const formularioLogin = document.getElementById("loginForm");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("usuario").value.trim();
        const senha = document.getElementById("senha").value;
        const mensagem = document.getElementById("mensagemLogin");
        const botao = formularioLogin.querySelector("button[type='submit']");

        mensagem.textContent = "Entrando...";

        if (botao) botao.disabled = true;

        try {
            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email: email,
                    password: senha
                });

            if (error) {
                console.log("Erro de login:", error.message);

                if (error.message.includes("Email not confirmed")) {
                    mensagem.textContent =
                        "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada e o spam.";
                } else if (
                    error.message.includes("Invalid login credentials")
                ) {
                    mensagem.textContent = "E-mail ou senha incorretos.";
                } else if (
                    error.message.toLowerCase().includes("rate limit")
                ) {
                    mensagem.textContent =
                        "Muitas tentativas. Aguarde um pouco e tente novamente.";
                } else {
                    mensagem.textContent =
                        "Erro ao entrar: " + error.message;
                }

                return;
            }

            mensagem.textContent = "Login realizado com sucesso!";

            console.log("Usuário autenticado:", data.user.email);

            // Vai direto para a página inicial
            window.location.href = "inicio.html";

        } catch (erro) {
            console.error("Erro inesperado no login:", erro);
            mensagem.textContent =
                "Não foi possível entrar. Tente novamente.";
        } finally {
            if (botao) botao.disabled = false;
        }
    });
}


/* ==========================================================
   CADASTRO
   ========================================================== */

const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
    cadastroForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("emailCadastro").value.trim();
        const senha = document.getElementById("senhaCadastro").value;
        const confirmarSenha =
            document.getElementById("confirmarSenha").value;

        const mensagem = document.getElementById("mensagemCadastro");
        const botao = cadastroForm.querySelector("button[type='submit']");

        // Validação dos campos
        if (!nome || !email || !senha || !confirmarSenha) {
            mensagem.textContent = "Preencha todos os campos.";
            return;
        }

        if (senha !== confirmarSenha) {
            mensagem.textContent = "As senhas não são iguais.";
            return;
        }

        if (senha.length < 6) {
            mensagem.textContent =
                "A senha precisa ter pelo menos 6 caracteres.";
            return;
        }

        mensagem.textContent = "Cadastrando...";

        if (botao) botao.disabled = true;

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: senha,
                options: {
                    data: {
                        nome: nome
                    }
                }
            });

            if (error) {
                console.error("Erro de cadastro:", error.message);

                if (
                    error.message.toLowerCase().includes("rate limit")
                ) {
                    mensagem.textContent =
                        "Muitas tentativas de cadastro. Aguarde um pouco e tente novamente.";
                } else if (
                    error.message.includes("you can only request this after")
                ) {
                    mensagem.textContent =
                        "Aguarde alguns segundos antes de tentar novamente.";
                } else {
                    mensagem.textContent =
                        "Erro ao cadastrar: " + error.message;
                }

                return;
            }

            // Verifica se o e-mail já está cadastrado
            if (data.user?.identities?.length === 0) {
                mensagem.textContent =
                    "Este e-mail já está cadastrado.";
                return;
            }

            mensagem.textContent =
                "Cadastro realizado! " +
                "Confirme seu e-mail, se solicitado. Redirecionando...";

            // Desativa o formulário durante a transição
            if (botao) botao.disabled = true;

            cadastroForm.classList.add("saindo");

            // Aguarda a animação e abre o login
            setTimeout(() => {
                window.location.href = "login.html";
            }, 500);

        } catch (erro) {
            console.error("Erro inesperado no cadastro:", erro);

            mensagem.textContent =
                "Não foi possível realizar o cadastro. Tente novamente.";

            if (botao) botao.disabled = false;
        }
    });
}