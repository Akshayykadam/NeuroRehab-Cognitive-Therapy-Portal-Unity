using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Loads localisation CSVs from Resources and resolves text keys at runtime.
/// Supports English, Hindi, Marathi, Arabic and dynamic switching.
/// 
/// CSV files must be placed at:
///   Assets/Resources/Localisation/MiniBest.csv
///   Assets/Resources/Localisation/FMAUE.csv
///
/// Usage:
///   LocalisationManager.SetLanguage("Hindi"); // or "English", "Marathi", "Arabic", "hi", "mr", "ar", "en"
///   string text = LocalisationManager.Get("MB_Q1_Title");
/// </summary>
public static class LocalisationManager
{
    private static string _currentLanguage = "English";
    public static string CurrentLanguage => _currentLanguage;

    private static readonly Dictionary<string, string> _table = new Dictionary<string, string>();
    private static bool _loaded = false;

    // ---------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------

    /// <summary>
    /// Sets the active language (e.g. "English", "Hindi", "Marathi", "Arabic")
    /// and reloads the localized dictionary.
    /// </summary>
    public static void SetLanguage(string languageName)
    {
        if (string.IsNullOrEmpty(languageName))
            languageName = "English";

        if (_currentLanguage != languageName || !_loaded)
        {
            _currentLanguage = languageName;
            Reload();
        }
    }

    /// <summary>
    /// Returns the localised string for the given key.
    /// Falls back to the key itself if not found, so the UI never goes blank.
    /// </summary>
    public static string Get(string key)
    {
        EnsureLoaded();
        if (_table.TryGetValue(key, out string value))
            return value;

        Debug.LogWarning($"[LocalisationManager] Key not found: '{key}' for language '{_currentLanguage}'");
        return key;
    }

    /// <summary>
    /// Force-reload all CSV files for the current language.
    /// </summary>
    public static void Reload()
    {
        _table.Clear();
        _loaded = false;
        EnsureLoaded();
    }

    // ---------------------------------------------------------------
    // Internal
    // ---------------------------------------------------------------

    private static void EnsureLoaded()
    {
        if (_loaded) return;

        LoadCSV("Localisation/MiniBest");
        LoadCSV("Localisation/FMAUE");

        _loaded = true;
        Debug.Log($"[LocalisationManager] Loaded {_table.Count} keys for language '{_currentLanguage}'.");
    }

    private static void LoadCSV(string resourcePath)
    {
        TextAsset csv = Resources.Load<TextAsset>(resourcePath);
        if (csv == null)
        {
            // Fallback for nested or alternative paths
            csv = Resources.Load<TextAsset>($"Localisation/{resourcePath}");
        }
        if (csv == null && resourcePath.Contains("/"))
        {
            string filenameOnly = resourcePath.Substring(resourcePath.LastIndexOf('/') + 1);
            csv = Resources.Load<TextAsset>(filenameOnly);
        }
        if (csv == null)
        {
            Debug.LogError($"[LocalisationManager] CSV not found at Resources/{resourcePath}");
            return;
        }

        string[] lines = csv.text.Split('\n');
        if (lines.Length < 2) return;

        // Parse header row to find language column
        string[] headers = SplitCSVLine(lines[0].Trim());
        int langCol = FindLanguageColumn(headers, _currentLanguage);

        for (int i = 1; i < lines.Length; i++) // skip header row
        {
            string line = lines[i].Trim();
            if (string.IsNullOrEmpty(line)) continue;

            string[] columns = SplitCSVLine(line);
            if (columns.Length == 0) continue;

            string key = columns[0].Trim();
            if (string.IsNullOrEmpty(key)) continue;

            string value = "";

            if (langCol < columns.Length)
            {
                value = columns[langCol].Trim();
            }

            // If empty in selected language, fallback to English (column 1)
            if (string.IsNullOrEmpty(value) && columns.Length > 1)
            {
                value = columns[1].Trim();
            }

            // If still empty, use key
            if (string.IsNullOrEmpty(value))
            {
                value = key;
            }

            _table[key] = value;
        }
    }

    private static int FindLanguageColumn(string[] headers, string lang)
    {
        if (headers == null || headers.Length <= 1) return 1;

        string search = lang.Trim().ToLowerInvariant();

        // 1. Direct name / prefix matching (English, Hindi, Marathi, Arabic)
        for (int i = 1; i < headers.Length; i++)
        {
            string header = headers[i].Trim().ToLowerInvariant();
            if (header == search || header.StartsWith(search) || search.StartsWith(header))
                return i;
        }

        // 2. Short language codes (en, hi, mr, ar)
        for (int i = 1; i < headers.Length; i++)
        {
            string h = headers[i].Trim().ToLowerInvariant();
            if (search == "en" && h.Contains("eng")) return i;
            if (search == "hi" && h.Contains("hin")) return i;
            if (search == "mr" && h.Contains("mar")) return i;
            if (search == "ar" && h.Contains("ara")) return i;
        }

        // Default to English (column 1)
        return 1;
    }

    /// <summary>
    /// Minimal CSV line splitter that respects double-quoted fields.
    /// </summary>
    private static string[] SplitCSVLine(string line)
    {
        var fields = new List<string>();
        bool inQuotes = false;
        var current = new System.Text.StringBuilder();

        for (int i = 0; i < line.Length; i++)
        {
            char c = line[i];

            if (c == '"')
            {
                if (inQuotes && i + 1 < line.Length && line[i + 1] == '"')
                {
                    current.Append('"'); // escaped quote
                    i++;
                }
                else
                {
                    inQuotes = !inQuotes;
                }
            }
            else if (c == ',' && !inQuotes)
            {
                fields.Add(current.ToString());
                current.Clear();
            }
            else
            {
                current.Append(c);
            }
        }

        fields.Add(current.ToString());
        return fields.ToArray();
    }
}
