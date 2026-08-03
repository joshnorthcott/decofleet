using Decofleet.IntegrationTests.Common;

namespace Decofleet.IntegrationTests.Api;

public sealed class HealthCheckTests : IClassFixture<DecofleetWebFactory>
{
    private readonly HttpClient _client;

    public HealthCheckTests(DecofleetWebFactory factory)
        => _client = factory.CreateClient();

    [Fact]
    public async Task HealthEndpoint_Returns200()
    {
        var response = await _client.GetAsync("/health");
        Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
    }
}
