using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class ValuesController : ControllerBase
{
    [HttpPost]
    [Route("api/ProcessData")]
    public ActionResult ProcessData([FromBody] string payload)
    {
        if (!TryParseJson(payload, out JObject? jsonData, out string? errorMessage))
        {
            return Problem(errorMessage!);
        }

        if (!TryParseKeywords(jsonData!, out Keywords? kws, out errorMessage))
        {
            return Problem(errorMessage!);
        }

        var delta = kws!.To.DayNumber - kws.From.DayNumber;
        var kwstr = JsonConvert.SerializeObject(kws, Formatting.Indented);

        return Ok($"{kwstr}\n\nThere are {delta} days between {kws.From} and {kws.To}.");
    }
    public static bool TryParseJson(string json, out JObject? jsonData, out string? errorMessage)
    {
        try
        {
            jsonData = JObject.Parse(json);
            errorMessage = null;
            return true;
        }
        catch (JsonReaderException e)
        {
            errorMessage = $"Bad JSON format: {e}";
            jsonData = null;
            return false;
        }
    }

    public static bool TryParseKeywords(JObject jsonData, out Keywords? kws, out string? errorMessage)
    {
        DateOnly from, to;
        try
        {
            from = DateOnly.Parse(jsonData.Value<string>("from") ?? "1970-01-01");
            to = DateOnly.Parse(jsonData.Value<string>("to") ?? "9999-01-01");
        }
        catch (FormatException e)
        {
            errorMessage = $"Bad date format: {e}";
            kws = null;
            return false;
        }

        kws = new Keywords
        {
            From = from,
            To = to,
            Location = jsonData.Value<string>("location"),
            Subject = jsonData.Value<string>("subject"),
            With = jsonData.Value<JArray>("with")?.ToObject<List<string>>()
        };
        errorMessage = null;
        return true;
    }
}
