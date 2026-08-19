using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Loads localisation CSVs from Resources and resolves text keys at runtime.
/// 
/// CSV files must be placed at:
///   Assets/Resources/Localisation/MiniBest.csv
///   Assets/Resources/Localisation/FMAUE.csv
///
/// Usage:
///   string text = LocalisationManager.Get("MB_Q1_Title");
/// </summary>
public static class LocalisationManager
{
    // Column index of the language to use (0 = Key, 1 = English, 2 = Arabic, etc.)
    private const int LanguageColumn = 1;

    private static readonly Dictionary<string, string> _table = new Dictionary<string, string>();
    private static bool _loaded = false;

    // ---------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------

    /// <summary>
    /// Returns the localised string for the given key.
    /// Falls back to the key itself if not found, so the UI never goes blank.
    /// </summary>
    public static string Get(string key)
    {
        EnsureLoaded();
        if (_table.TryGetValue(key, out string value))
            return value;

        Debug.LogWarning($"[LocalisationManager] Key not found: '{key}'");
        return key;
    }

    /// <summary>
    /// Force-reload all CSV files (useful if language is changed at runtime).
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
        Debug.Log($"[LocalisationManager] Loaded {_table.Count} keys.");
    }

    private static void LoadCSV(string resourcePath)
    {
        TextAsset csv = Resources.Load<TextAsset>(resourcePath);
        if (csv == null)
        {
            Debug.LogError($"[LocalisationManager] CSV not found at Resources/{resourcePath}");
            return;
        }

        string[] lines = csv.text.Split('\n');

        for (int i = 1; i < lines.Length; i++) // skip header row
        {
            string line = lines[i].Trim();
            if (string.IsNullOrEmpty(line)) continue;

            string[] columns = SplitCSVLine(line);
            if (columns.Length < LanguageColumn + 1) continue;

            string key   = columns[0].Trim();
            string value = columns[LanguageColumn].Trim();

            if (!string.IsNullOrEmpty(key))
                _table[key] = value;
        }
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
