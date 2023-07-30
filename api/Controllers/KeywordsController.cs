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
        JObject jsonData;
        try
        {
            jsonData = JObject.Parse(payload);
        }
        catch (JsonReaderException e)
        {
            return Problem($"Bad JSON format: {e}");
        }

        Keywords kws;
        try
        {
            kws = new Keywords
            {
                From = DateOnly.Parse(jsonData.Value<string>("from") ?? "1970-01-01"),
                To = DateOnly.Parse(jsonData.Value<string>("to") ?? "9999-01-01"),
                Location = jsonData.Value<string>("location"),
                Subject = jsonData.Value<string>("subject"),
                With = jsonData.Value<JArray>("with")?.ToObject<List<string>>()
            };
        }
        catch (FormatException e)
        {
            return Problem($"Bad date format: {e}");
        }
        catch (ArgumentNullException e)
        {
            return Problem($"No date given: {e}");
        }

        var delta = kws.To.DayNumber - kws.From.DayNumber;
        var kwstr = JsonConvert.SerializeObject(kws, Formatting.Indented);

        return Ok($"{kwstr}\n\nThere are {delta} days between {kws.From} and {kws.To}.");
    }
}
