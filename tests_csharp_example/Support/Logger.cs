using System;
using System.IO;

namespace VintageDagoShop.Automation.Support
{
    /// <summary>
    /// Logger - Structured Logging Utility
    /// 
    /// Provides:
    /// - Hierarchical logging (Info, Warn, Error, Debug)
    /// - Console output with formatting
    /// - File logging (optional)
    /// - Log levels
    /// 
    /// Usage:
    /// Logger.Info("Message");
    /// Logger.Error("Error message");
    /// Logger.Warn("Warning message");
    /// Logger.Debug("Debug message");
    /// </summary>
    public static class Logger
    {
        // ==================== Log Levels ====================
        private enum LogLevel
        {
            Debug,
            Info,
            Warn,
            Error
        }

        // ==================== Configuration ====================
        private static readonly bool EnableFileLogging = false;
        private static readonly string LogFilePath = "logs/test-execution.log";
        private static readonly object LockObject = new object();

        // ==================== Public Methods ====================

        /// <summary>
        /// Log info message
        /// </summary>
        public static void Info(string message)
        {
            LogMessage(LogLevel.Info, message);
        }

        /// <summary>
        /// Log warning message
        /// </summary>
        public static void Warn(string message)
        {
            LogMessage(LogLevel.Warn, message);
        }

        /// <summary>
        /// Log error message
        /// </summary>
        public static void Error(string message)
        {
            LogMessage(LogLevel.Error, message);
        }

        /// <summary>
        /// Log debug message
        /// </summary>
        public static void Debug(string message)
        {
            LogMessage(LogLevel.Debug, message);
        }

        /// <summary>
        /// Log formatted message with context
        /// </summary>
        public static void LogFormatted(string prefix, string message)
        {
            Info($"{prefix}: {message}");
        }

        // ==================== Private Methods ====================

        /// <summary>
        /// Internal method to log message
        /// </summary>
        private static void LogMessage(LogLevel level, string message)
        {
            lock (LockObject)
            {
                // Get timestamp
                string timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff");

                // Format message
                string formattedMessage = $"[{timestamp}] [{level,5}] {message}";

                // Write to console with color
                WriteToConsole(level, formattedMessage);

                // Write to file if enabled
                if (EnableFileLogging)
                    WriteToFile(formattedMessage);
            }
        }

        /// <summary>
        /// Write to console with color coding
        /// </summary>
        private static void WriteToConsole(LogLevel level, string message)
        {
            ConsoleColor originalColor = Console.ForegroundColor;

            try
            {
                // Set color based on level
                Console.ForegroundColor = level switch
                {
                    LogLevel.Info => ConsoleColor.Green,
                    LogLevel.Warn => ConsoleColor.Yellow,
                    LogLevel.Error => ConsoleColor.Red,
                    LogLevel.Debug => ConsoleColor.Gray,
                    _ => ConsoleColor.White
                };

                Console.WriteLine(message);
            }
            finally
            {
                Console.ForegroundColor = originalColor;
            }
        }

        /// <summary>
        /// Write to log file
        /// </summary>
        private static void WriteToFile(string message)
        {
            try
            {
                // Ensure directory exists
                string directory = Path.GetDirectoryName(LogFilePath);
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                // Append to log file
                File.AppendAllText(LogFilePath, message + Environment.NewLine);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to write to log file: {ex.Message}");
            }
        }
    }
}
