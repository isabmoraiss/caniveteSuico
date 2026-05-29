using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace MvcMarylsa.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            ViewBag.RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
