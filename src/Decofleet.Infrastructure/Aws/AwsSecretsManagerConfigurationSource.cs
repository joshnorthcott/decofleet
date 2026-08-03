using Amazon;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace Decofleet.Infrastructure.Aws;

/// <summary>
/// Pulls a single AWS Secrets Manager secret (JSON blob) into the
/// configuration pipeline. Each JSON key becomes a config key using
/// the standard <c>__</c> → <c>:</c> separator convention.
///
/// Activate by setting <c>AWS_SECRETS_MANAGER_SECRET_ID</c> env var.
/// Optionally set <c>AWS_REGION</c> (defaults to us-east-1).
///
/// The secret value should be a JSON object like:
/// <code>
/// {
///   "ConnectionStrings__DefaultConnection": "Host=...;...",
///   "Jwt__SecretKey": "your-256-bit-secret"
/// }
/// </code>
/// </summary>
public sealed class AwsSecretsManagerConfigurationSource : IConfigurationSource
{
    public string SecretId { get; set; } = string.Empty;
    public string Region    { get; set; } = "us-east-1";

    public IConfigurationProvider Build(IConfigurationRoot root)
        => new AwsSecretsManagerConfigurationProvider(SecretId, Region);
}

public sealed class AwsSecretsManagerConfigurationProvider : ConfigurationProvider
{
    private readonly string _secretId;
    private readonly string _region;

    public AwsSecretsManagerConfigurationProvider(string secretId, string region)
    {
        _secretId = secretId;
        _region   = region;
    }

    public override void Load()
    {
        try
        {
            using var client = new AmazonSecretsManagerClient(RegionEndpoint.GetBySystemName(_region));

            var request  = new GetSecretValueRequest { SecretId = _secretId };
            var response = client.GetSecretValueAsync(request).GetAwaiter().GetResult();

            var json = response.SecretString
                ?? throw new InvalidOperationException(
                    $"AWS Secrets Manager secret '{_secretId}' returned no SecretString.");

            using var doc = JsonDocument.Parse(json);

            foreach (var prop in doc.RootElement.EnumerateObject())
            {
                // AWS SM uses __ as the config hierarchy separator
                var key   = prop.Name.Replace("__", ":");
                var value = prop.Value.GetString() ?? string.Empty;
                Data[key] = value;
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException(
                $"Failed to load secrets from AWS Secrets Manager (secret: '{_secretId}'). " +
                $"Ensure the IAM role/credentials have secretsmanager:GetSecretValue permission. " +
                $"Inner: {ex.Message}", ex);
        }
    }
}

// Extension method for clean registration
public static class AwsSecretsManagerExtensions
{
    public static IConfigurationBuilder AddAwsSecretsManager(
        this IConfigurationBuilder builder,
        string secretId,
        string region = "us-east-1")
    {
        builder.Add(new AwsSecretsManagerConfigurationSource
        {
            SecretId = secretId,
            Region   = region,
        });
        return builder;
    }
}
