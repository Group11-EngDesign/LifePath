using Microsoft.AspNetCore.Mvc;
namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class ValuesController : ControllerBase
{
    [HttpPost]
    [Route("api/ProcessData")]
    public ActionResult ProcessData(Keywords keywords)
    {
        var delta = keywords.To.DayNumber - keywords.From.DayNumber;

        return Ok($"There are ${delta} days between ${keywords.From} and ${keywords.To}.");
    }
}
