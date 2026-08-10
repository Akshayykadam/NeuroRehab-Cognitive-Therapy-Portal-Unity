using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class BuildScript
{
    [MenuItem("Build/Build Android APK")]
    public static void BuildAndroidAPK()
    {
        Debug.Log("[BuildScript] Starting Android APK Build...");

        string buildDir = Path.Combine(Directory.GetCurrentDirectory(), "Builds");
        if (!Directory.Exists(buildDir))
        {
            Directory.CreateDirectory(buildDir);
        }

        string apkPath = Path.Combine(buildDir, "NeuroRehab.apk");

        string[] scenes = new string[] { "Assets/Neuro-Rehab/Scenes/NeuroRehabScene.unity" };

        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = apkPath,
            target = BuildTarget.Android,
            options = BuildOptions.None
        };

        BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);
        BuildSummary summary = report.summary;

        if (summary.result == BuildResult.Succeeded)
        {
            Debug.Log($"[BuildScript] Android APK Build SUCCESS! Size: {summary.totalSize} bytes at: {apkPath}");
        }
        else if (summary.result == BuildResult.Failed)
        {
            Debug.LogError($"[BuildScript] Android APK Build FAILED with {summary.totalErrors} errors!");
            if (Application.isBatchMode)
            {
                EditorApplication.Exit(1);
            }
        }
    }
}
