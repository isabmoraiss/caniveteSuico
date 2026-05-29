using Microsoft.AspNetCore.Mvc;
using System;

namespace MvcMarylsa.Controllers
{
    public class SorteadorController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.NumeroInicial = 1;
            ViewBag.NumeroFinal = 100;
            ViewBag.Sorteou = false;
            return View();
        }

        [HttpPost]
        public IActionResult Index(int numeroInicial, int numeroFinal)
        {
            if (numeroInicial > numeroFinal)
            {
                ViewBag.Erro = "O número inicial não pode ser superior ao número de encerramento.";
                ViewBag.NumeroInicial = numeroInicial;
                ViewBag.NumeroFinal = numeroFinal;
                ViewBag.Sorteou = false;
                return View();
            }

            var random = new Random();
            int numeroSorteado = random.Next(numeroInicial, numeroFinal + 1);

            ViewBag.NumeroInicial = numeroInicial;
            ViewBag.NumeroFinal = numeroFinal;
            ViewBag.NumeroSorteado = numeroSorteado;
            ViewBag.Sorteou = true;

            return View();
        }
    }
}
