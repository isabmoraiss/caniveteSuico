using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace MvcMarylsa.Controllers
{
    public class ValidadorController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Calculado = false;
            return View();
        }

        [HttpPost]
        public IActionResult Index(string documento)
        {
            if (string.IsNullOrWhiteSpace(documento))
            {
                ViewBag.Erro = "Por favor, digite um CPF ou CNPJ para verificação.";
                ViewBag.Calculado = false;
                return View();
            }

            // Clean any dots, dashes or slashes
            string limpo = Regex.Replace(documento, @"\D", "");
            string tipo = "";
            bool valido = false;
            string mensagemExibicao = "";
            string documentoFormatado = "";

            if (limpo.Length == 11)
            {
                tipo = "CPF";
                valido = ValidarCpf(limpo);
                if (valido)
                {
                    mensagemExibicao = "O CPF informado é Válido ✅";
                    documentoFormatado = Regex.Replace(limpo, @"(\d{3})(\d{3})(\d{3})(\d{2})", "$1.$2.$3-$4");
                }
                else
                {
                    mensagemExibicao = "O CPF informado é Inválido ❌";
                }
            }
            else if (limpo.Length == 14)
            {
                tipo = "CNPJ";
                valido = ValidarCnpj(limpo);
                if (valido)
                {
                    mensagemExibicao = "O CNPJ informado é Válido ✅";
                    documentoFormatado = Regex.Replace(limpo, @"(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})", "$1.$2.$3/$4-$5");
                }
                else
                {
                    mensagemExibicao = "O CNPJ informado é Inválido ❌";
                }
            }
            else
            {
                tipo = "Desconhecido";
                valido = false;
                mensagemExibicao = $"Quantidade de dígitos incorreta ({limpo.Length}). Um CPF necessita de 11 números, e um CNPJ de 14.";
            }

            ViewBag.Documento = documento;
            ViewBag.DocumentoLimpo = limpo;
            ViewBag.Tipo = tipo;
            ViewBag.Valido = valido;
            ViewBag.MensagemExibicao = mensagemExibicao;
            ViewBag.DocumentoFormatado = documentoFormatado;
            ViewBag.Calculado = true;

            return View();
        }

        private bool ValidarCpf(string cpf)
        {
            if (cpf.Length != 11) return false;
            
            // Check if string is composed of identical repeated numbers (e.g., 22222222222)
            if (new string(cpf[0], 11) == cpf) return false;

            // Validate 1st digit
            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += int.Parse(cpf[i].ToString()) * (10 - i);
            int resto = (soma * 10) % 11;
            if (resto == 10 || resto == 11) resto = 0;
            if (resto != int.Parse(cpf[9].ToString())) return false;

            // Validate 2nd digit
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(cpf[i].ToString()) * (11 - i);
            resto = (soma * 10) % 11;
            if (resto == 10 || resto == 11) resto = 0;
            if (resto != int.Parse(cpf[10].ToString())) return false;

            return true;
        }

        private bool ValidarCnpj(string cnpj)
        {
            if (cnpj.Length != 14) return false;
            
            if (new string(cnpj[0], 14) == cnpj) return false;

            // Validate 1st digit
            int[] multiplicador1 = new int[12] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int soma = 0;
            for (int i = 0; i < 12; i++)
                soma += int.Parse(cnpj[i].ToString()) * multiplicador1[i];
            
            int resto = soma % 11;
            int resultado = resto < 2 ? 0 : 11 - resto;
            if (resultado != int.Parse(cnpj[12].ToString())) return false;

            // Validate 2nd digit
            int[] multiplicador2 = new int[13] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            soma = 0;
            for (int i = 0; i < 13; i++)
                soma += int.Parse(cnpj[i].ToString()) * multiplicador2[i];
            
            resto = soma % 11;
            resultado = resto < 2 ? 0 : 11 - resto;
            if (resultado != int.Parse(cnpj[13].ToString())) return false;

            return true;
        }
    }
}
