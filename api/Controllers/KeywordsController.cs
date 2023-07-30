using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Dynamic;
namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class ValuesController : ControllerBase
{
    [HttpPost]
    [Route("api/ProcessData")]
    public ActionResult ProcessData([FromBody] string payload)
    {
        JObject jsonData = JObject.Parse(payload);
        var kws = new Keywords
        {
            From = DateOnly.Parse(jsonData["from"].ToString()),
            To = DateOnly.Parse(jsonData["to"].ToString()),
            Location = jsonData.ContainsKey("location") ? jsonData["location"].ToString() : null,
            Subject = jsonData.ContainsKey("subject") ? jsonData["subject"].ToString() : null,
            With = jsonData.ContainsKey("with") ? jsonData["with"].ToObject<List<string>>() : null,
        };

        var delta = kws?.To.DayNumber - kws?.From.DayNumber;

        return Ok($"There are {delta ?? 0} days between {kws?.From} and {kws?.To}.");
    }
}
