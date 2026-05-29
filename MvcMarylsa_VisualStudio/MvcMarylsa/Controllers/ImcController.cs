using Microsoft.AspNetCore.Mvc;

namespace MvcMarylsa.Controllers
{
    public class ImcController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Calculado = false;
            return View();
        }

        [HttpPost]
        public IActionResult Index(double peso, double altura)
        {
            if (peso <= 0 || altura <= 0)
            {
                ViewBag.Erro = "O peso e a altura devem ser valores maiores que zero.";
                ViewBag.Calculado = false;
                return View();
            }

            double imcValor = peso / (altura * altura);
            string classificacao = "";

            if (imcValor < 18.5)
                classificacao = "Abaixo do peso";
            else if (imcValor < 25)
                classificacao = "Peso normal";
            else if (imcValor < 30)
                classificacao = "Sobrepeso";
            else if (imcValor < 35)
                classificacao = "Obesidade Grau I";
            else if (imcValor < 40)
                classificacao = "Obesidade Grau II";
            else
                classificacao = "Obesidade Grau III";

            ViewBag.Peso = peso;
            ViewBag.Altura = altura;
            ViewBag.ImcValor = imcValor;
            ViewBag.Classificacao = classificacao;
            ViewBag.Calculado = true;

            return View();
        }
    }
}
