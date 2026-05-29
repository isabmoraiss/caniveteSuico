using Microsoft.AspNetCore.Mvc;

namespace MvcMarylsa.Controllers
{
    public class MedidasController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.ValorOriginal = 85;
            ViewBag.TipoConversao = "FAHR_CELS";
            ViewBag.Calculado = false;
            return View();
        }

        [HttpPost]
        public IActionResult Index(double valorOriginal, string tipoConversao)
        {
            double resultado = 0;
            string unidadeOrigem = "";
            string unidadeDestino = "";
            bool calculado = true;

            switch (tipoConversao)
            {
                case "POL_CM":
                    resultado = valorOriginal * 2.54;
                    unidadeOrigem = "pol";
                    unidadeDestino = "cm";
                    break;
                case "FAHR_CELS":
                    resultado = ((valorOriginal - 32) * 5) / 9;
                    unidadeOrigem = "°F";
                    unidadeDestino = "°C";
                    break;
                case "GAL_LIT":
                    resultado = valorOriginal * 3.78541;
                    unidadeOrigem = "galões";
                    unidadeDestino = "litros";
                    break;
                case "LIB_KG":
                    resultado = valorOriginal * 0.45359237;
                    unidadeOrigem = "libras";
                    unidadeDestino = "kg";
                    break;
                default:
                    calculado = false;
                    break;
            }

            ViewBag.ValorOriginal = valorOriginal;
            ViewBag.TipoConversao = tipoConversao ?? "FAHR_CELS";
            ViewBag.Resultado = resultado;
            ViewBag.UnidadeOrigem = unidadeOrigem;
            ViewBag.UnidadeDestino = unidadeDestino;
            ViewBag.Calculado = calculado;

            return View();
        }
    }
}
