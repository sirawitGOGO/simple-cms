namespace CmsApi.Configs
{
    public class Configs
    {
        public static string DbConnection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "The DB_CONNECTION environment variable is not set.";
        public static string FrontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "The FRONTEND_URL environment variable is not set.";
    }
}