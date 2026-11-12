using NUnit.Framework;
using System;
using VintageDagoShop.Automation.Support;

namespace VintageDagoShop.Automation.Tests
{
    /// <summary>
    /// Base Test Case Class
    /// 
    /// Provides:
    /// - Common setup/teardown logic
    /// - Logging helpers
    /// - Assertion helpers
    /// - Test execution context
    /// 
    /// All test classes should inherit from this.
    /// </summary>
    public abstract class BaseTestCase
    {
        // ==================== Protected Fields ====================
        protected string TestCaseId { get; set; }
        protected Guid RunId { get; set; }
        protected Guid CaseExecutionId { get; set; }

        // ==================== Constructors ====================

        /// <summary>
        /// Initialize base test case with IDs for traceability
        /// </summary>
        protected BaseTestCase(string testCaseId, Guid runId, Guid caseExecutionId)
        {
            TestCaseId = testCaseId;
            RunId = runId;
            CaseExecutionId = caseExecutionId;
        }

        // ==================== Logging Methods ====================

        /// <summary>
        /// Log info message to console
        /// </summary>
        protected void LogInfo(string message)
        {
            Logger.Info(message);
        }

        /// <summary>
        /// Log warning message to console
        /// </summary>
        protected void LogWarn(string message)
        {
            Logger.Warn(message);
        }

        /// <summary>
        /// Log error message to console
        /// </summary>
        protected void LogError(string message)
        {
            Logger.Error(message);
        }

        /// <summary>
        /// Log debug message to console
        /// </summary>
        protected void LogDebug(string message)
        {
            Logger.Debug(message);
        }

        /// <summary>
        /// Log test step with formatted output
        /// </summary>
        protected void LogStep(int stepNumber, string description)
        {
            LogInfo($"STEP {stepNumber}: {description}");
        }

        /// <summary>
        /// Log precondition
        /// </summary>
        protected void LogPrecondition(string condition)
        {
            LogInfo($"PRECONDITION: {condition}");
        }

        /// <summary>
        /// Log expected result
        /// </summary>
        protected void LogExpectedResult(string expected)
        {
            LogInfo($"EXPECTED: {expected}");
        }

        /// <summary>
        /// Log actual result
        /// </summary>
        protected void LogActualResult(string actual)
        {
            LogInfo($"ACTUAL: {actual}");
        }

        /// <summary>
        /// Log test result
        /// </summary>
        protected void LogTestResult(string result)
        {
            if (result.ToUpper().Contains("PASS"))
                LogInfo($"✓ {result}");
            else
                LogError($"✗ {result}");
        }

        // ==================== Assertion Helpers ====================

        /// <summary>
        /// Assert that URL contains expected string
        /// </summary>
        protected void AssertUrlContains(string url, string expectedPart)
        {
            LogInfo($"Verifying URL contains: {expectedPart}");
            Assert.That(url, Does.Contain(expectedPart),
                $"URL should contain '{expectedPart}' but was '{url}'");
            LogTestResult("URL verified");
        }

        /// <summary>
        /// Assert that string equals expected value
        /// </summary>
        protected void AssertStringEquals(string actual, string expected, string message = "")
        {
            LogInfo($"Verifying: {message}");
            Assert.That(actual, Is.EqualTo(expected),
                $"{message} - Expected: '{expected}', Actual: '{actual}'");
            LogTestResult("String assertion passed");
        }

        /// <summary>
        /// Assert that number equals expected value
        /// </summary>
        protected void AssertNumberEquals(int actual, int expected, string message = "")
        {
            LogInfo($"Verifying: {message}");
            Assert.That(actual, Is.EqualTo(expected),
                $"{message} - Expected: {expected}, Actual: {actual}");
            LogTestResult("Number assertion passed");
        }

        /// <summary>
        /// Assert that boolean is true
        /// </summary>
        protected void AssertIsTrue(bool condition, string message = "")
        {
            LogInfo($"Verifying condition: {message}");
            Assert.That(condition, Is.True, message);
            LogTestResult("Boolean assertion passed");
        }

        /// <summary>
        /// Assert that boolean is false
        /// </summary>
        protected void AssertIsFalse(bool condition, string message = "")
        {
            LogInfo($"Verifying condition: {message}");
            Assert.That(condition, Is.False, message);
            LogTestResult("Boolean assertion passed");
        }

        /// <summary>
        /// Assert that value is not null
        /// </summary>
        protected void AssertIsNotNull(object value, string message = "")
        {
            LogInfo($"Verifying not null: {message}");
            Assert.That(value, Is.Not.Null, message);
            LogTestResult("Not null assertion passed");
        }
    }
}
