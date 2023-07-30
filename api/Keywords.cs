namespace api;

public class Keywords
{
    public DateOnly From { get; set; } = DateOnly.MinValue;
    public DateOnly To { get; set; } = DateOnly.MaxValue;
    public string? Location { get; set; }
    public string? Subject { get; set; }
    public List<string>? With { get; set; }
}
