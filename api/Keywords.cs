namespace api;

public class Keywords
{
    public DateOnly From { get; set; }
    public DateOnly To { get; set; }
    public string? Location { get; set; }
    public string? Subject { get; set; }
    public List<string>? With { get; set; }
}
