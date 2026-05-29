using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace MvcMarylsa.Controllers
{
    public class CambioController : Controller
    {
        private static readonly HttpClient client = new HttpClient();

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            double cotacaoUsd = 5.06;
            double cotacaoEur = 5.52;

            try
            {
                // Consumir API de câmbio AwesomeAPI
                var response = await client.GetStringAsync("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL");
                using (JsonDocument doc = JsonDocument.Parse(response))
                {
                    if (doc.RootElement.TryGetProperty("USDBRL", out JsonElement usdProperty))
                    {
                        if (usdProperty.TryGetProperty("ask", out JsonElement askProp))
                        {
                            cotacaoUsd = double.Parse(askProp.GetString().Replace(".", ","));
                        }
                    }
                    if (doc.RootElement.TryGetProperty("EURBRL", out JsonElement eurProperty))
                    {
                        if (eurProperty.TryGetProperty("ask", out JsonElement eurAskProp))
                        {
                            cotacaoEur = double.Parse(eurAskProp.GetString().Replace(".", ","));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Não foi possível carregar a cotação em tempo real. Exibindo valor histórico: " + ex.Message;
            }

            ViewBag.CotacaoUsd = cotacaoUsd;
            ViewBag.CotacaoEur = cotacaoEur;
            ViewBag.Calculado = false;

            return View();
        }

        [HttpPost]
        public IActionResult Index(double valorUsd, double cotacaoUsd, double cotacaoEur)
        {
            if (cotacaoUsd <= 0) cotacaoUsd = 5.06;
            if (cotacaoEur <= 0) cotacaoEur = 5.52;

            double resultadoBrl = valorUsd * cotacaoUsd;

            ViewBag.ValorUsd = valorUsd;
            ViewBag.CotacaoUsd = cotacaoUsd;
            ViewBag.CotacaoEur = cotacaoEur;
            ViewBag.ResultadoBrl = resultadoBrl;
            ViewBag.Calculado = valorUsd > 0;

            return View();
        }
    }
}
