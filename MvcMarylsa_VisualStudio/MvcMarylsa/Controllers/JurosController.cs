using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace MvcMarylsa.Controllers
{
    public class JurosPontoMensal
    {
        public int Mes { get; set; }
        public double MontanteAcumulado { get; set; }
        public double JurosAcumulados { get; set; }
    }

    public class JurosController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Capital = 1000;
            ViewBag.Taxa = 1.5;
            ViewBag.Meses = 12;
            ViewBag.Calculado = false;
            return View();
        }

        [HttpPost]
        public IActionResult Index(double capital, double taxa, int meses)
        {
            if (capital <= 0 || taxa <= 0 || meses <= 0)
            {
                ViewBag.Erro = "Por favor, preencha todos os campos com valores válidos maiores do que zero.";
                ViewBag.Capital = capital;
                ViewBag.Taxa = taxa;
                ViewBag.Meses = meses;
                ViewBag.Calculado = false;
                return View();
            }

            double taxaDecimal = taxa / 100;
            var pontosMensais = new List<JurosPontoMensal>();

            for (int m = 0; m <= meses; m++)
            {
                // Fórmula: M = P * (1 + i) ^ t
                double montante = capital * Math.Pow(1 + taxaDecimal, m);
                double juros = montante - capital;

                pontosMensais.Add(new JurosPontoMensal
                {
                    Mes = m,
                    MontanteAcumulado = Math.Round(montante, 2),
                    JurosAcumulados = Math.Round(juros, 2)
                });
            }

            double montanteFinal = pontosMensais[pontosMensais.Count - 1].MontanteAcumulado;
            double totalJuros = pontosMensais[pontosMensais.Count - 1].JurosAcumulados;

            ViewBag.Capital = capital;
            ViewBag.Taxa = taxa;
            ViewBag.Meses = meses;
            ViewBag.PontosMensais = pontosMensais;
            ViewBag.MontanteFinal = montanteFinal;
            ViewBag.TotalJuros = totalJuros;
            ViewBag.Calculado = true;

            return View();
        }
    }
}
